"use client";

import * as THREE from "three";

/**
 * Adaptive degradation guard for the crystal showcase.
 *
 * Capability probe (runs once, before any canvas is mounted):
 *  - WebGL2 availability
 *  - floating-point (half-float) render target completeness, the format three.js
 *    needs for the physically-based transmission buffer
 * Both checks run on a detached canvas that is immediately destroyed, so a
 * failed probe costs nothing and never logs a console error.
 *
 * FPS guard (runs per frame once the scene is live):
 *  - rolling window of frame deltas sampled from the R3F loop
 *  - warmup period ignored so texture upload / shader compile jank does not
 *    count against the budget
 *  - two consecutive slow windows (< 45 fps) trigger the next tier of the
 *    fallback chain
 */

export interface GpuCapabilities {
  webgl2: boolean;
  floatTargets: boolean;
  /** Rough renderer-level sanity: max texture size, depth bits. */
  maxTextureSize: number;
}

export function probeCapabilities(): GpuCapabilities | null {
  if (typeof window === "undefined") return null;
  let canvas: HTMLCanvasElement | null = null;
  try {
    canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: false,
      antialias: false,
      depth: true,
    }) as WebGL2RenderingContext | null;
    if (!gl) return null;

    let floatTargets = false;
    try {
      const ext = gl.getExtension("EXT_color_buffer_half_float");
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        ext ? ext.RGBA16F_EXT : (gl as WebGL2RenderingContext).RGBA16F,
        4,
        4,
        0,
        (gl as WebGL2RenderingContext).RGBA,
        (gl as WebGL2RenderingContext).HALF_FLOAT,
        null
      );
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer((gl as WebGL2RenderingContext).FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        (gl as WebGL2RenderingContext).FRAMEBUFFER,
        (gl as WebGL2RenderingContext).COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0
      );
      floatTargets =
        gl.checkFramebufferStatus((gl as WebGL2RenderingContext).FRAMEBUFFER) ===
        (gl as WebGL2RenderingContext).FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer((gl as WebGL2RenderingContext).FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(tex);
    } catch {
      floatTargets = false;
    }

    const caps: GpuCapabilities = {
      webgl2: true,
      floatTargets,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
    };
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return caps;
  } catch {
    return null;
  } finally {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
      canvas = null;
    }
  }
}

export type DegradeTier = "matcap" | "css";

export interface FpsGuardOptions {
  /** Minimum acceptable fps averaged over the window. */
  minFps?: number;
  /** Length of each measurement window in ms. */
  windowMs?: number;
  /** Frames that must land in a window for it to be judged. */
  minFrames?: number;
  /** Ignore this much startup jank (ms). */
  warmupMs?: number;
  /** Called with the measured average fps of the slow window. */
  onSlow: (measuredFps: number) => void;
}

export class FpsGuard {
  private readonly minFps: number;
  private readonly windowMs: number;
  private readonly minFrames: number;
  private readonly warmupMs: number;
  private readonly onSlow: (fps: number) => void;

  private elapsed = 0;
  private frames = 0;
  private windowElapsed = 0;
  private strikes = 0;
  private lastReport: number | null = null;

  constructor(opts: FpsGuardOptions) {
    this.minFps = opts.minFps ?? 45;
    this.windowMs = opts.windowMs ?? 2000;
    this.minFrames = opts.minFrames ?? 30;
    this.warmupMs = opts.warmupMs ?? 1800;
    this.onSlow = opts.onSlow;
  }

  /**
   * Feed one frame. `deltaMs` is the frame delta in ms, `nowMs` a monotonic
   * stamp used for warmup tracking. Returns the latest judged window fps or
   * null while still inside knowledge-gathering windows.
   */
  sample(deltaMs: number, nowMs: number): { avgFps: number; slow: boolean } | null {
    if (nowMs < this.warmupMs) {
      this.elapsed += deltaMs;
      return null;
    }
    this.frames += 1;
    this.windowElapsed += deltaMs;
    this.elapsed += deltaMs;
    if (this.windowElapsed < this.windowMs || this.frames < this.minFrames) return null;

    const avgFps = (this.frames * 1000) / this.windowElapsed;
    this.lastReport = avgFps;
    this.windowElapsed = 0;
    this.frames = 0;

    if (avgFps < this.minFps) {
      this.strikes += 1;
      if (this.strikes >= 2) {
        this.strikes = 0;
        this.onSlow(avgFps);
      }
    } else {
      this.strikes = 0;
    }
    return { avgFps, slow: false };
  }

  /** Latest judged frame-time in ms (end-to-end per frame). */
  get lastFrameMs(): number | null {
    return this.lastReport !== null ? 1000 / this.lastReport : null;
  }

  /** Reported when the guard fires. Kept at info level, never error/warn. */
  static report(fps: number, neck: string): void {
    if (typeof console !== "undefined") {
      console.info(`[crystal] FPS guard: ${fps.toFixed(1)} fps avg, degrading to ${neck}.`);
    }
  }
}

/** Shared, cached PMREM environment used for reflections + transmission. */
let cachedEnv: {
  texture: THREE.Texture;
  renderer: THREE.WebGLRenderer;
} | null = null;

/** Dispose the cached environment if it belongs to a different renderer. */
function staleEnv(renderer: THREE.WebGLRenderer): void {
  if (cachedEnv && cachedEnv.renderer !== renderer) {
    cachedEnv.texture.dispose();
    cachedEnv = null;
  }
}

/**
 * Build a small procedural equirect environment (dark navy field with teal and
 * violet light wells plus a bright specular streak) and pre-filter it through
 * PMREMGenerator. PMREM output is a mipmapped roughness cube chain, so
 * roughness levels are precomputed once and cached across frames and mounts
 * (repeat uses are free). Returns a guarded dispose handle.
 */
export function getCrystalEnvironment(renderer: THREE.WebGLRenderer): {
  texture: THREE.Texture;
  dispose: () => void;
} {
  staleEnv(renderer);
  if (cachedEnv && cachedEnv.renderer === renderer) {
    return { texture: cachedEnv.texture, dispose: () => {} };
  }

  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = size * 2;
  cv.height = size;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, cv.width, cv.height);

  const well = (cx: number, cy: number, r: number, color: string, alpha: number) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalAlpha = 1;
  };
  well(size * 0.3, size * 0.42, size * 0.7, "#00d4aa", 0.85);
  well(size * 1.45, size * 0.5, size * 0.75, "#8b5cf6", 0.8);
  well(size * 1.0, size * 0.75, size * 0.5, "#1b3a5c", 0.7);

  // Bright specular streak the facets can catch.
  ctx.strokeStyle = "#f5ffff";
  ctx.lineWidth = size * 0.045;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.24);
  ctx.lineTo(size * 0.62, size * 0.5);
  ctx.stroke();

  const equirect = new THREE.CanvasTexture(cv);
  equirect.mapping = THREE.EquirectangularReflectionMapping;
  equirect.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const target = pmrem.fromEquirectangular(equirect);
  equirect.dispose();
  pmrem.dispose();

  cachedEnv = { texture: target.texture, renderer };
  return {
    texture: target.texture,
    dispose: () => {
      if (cachedEnv && cachedEnv.renderer === renderer) {
        target.texture.dispose();
        cachedEnv = null;
      }
    },
  };
}
