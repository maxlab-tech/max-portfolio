"use client";

import * as THREE from "three";

/**
 * Procedural textures for the crystal showcase:
 *  - a matcap fallback texture (sphere-shaded gradient with chromatic RGB rims
 *    baked in) used when the physical transmission pipeline must be disabled,
 *  - shared, cached CanvasTextures (mipmaps generated once, reused on
 *    remount; explicitly disposed with disposeCrystalTextures()).
 */

const MATCAP_SIZE = 256;

export interface CrystalTextures {
  matcap: THREE.CanvasTexture;
  dispose: () => void;
}

let cached: CrystalTextures | null = null;

export function getCrystalTextures(): CrystalTextures {
  if (cached) return cached;

  const size = MATCAP_SIZE;
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d")!;
  const half = size / 2;

  // Base sphere shading: dark lower half, lit upper half.
  const base = ctx.createRadialGradient(half, half * 0.9, half * 0.15, half, half, half);
  base.addColorStop(0, "#eafffa");
  base.addColorStop(0.55, "#5e8f8c");
  base.addColorStop(0.85, "#101b22");
  base.addColorStop(1, "#050508");
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();

  // Baked chromatic rim: red / green / blue arcs slightly offset, i.e. the
  // classic dispersion look a fresnel rim produces at the sphere silhouette.
  const rimArc = (dx: number, color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(half + dx, half, half * 0.93, 0, Math.PI * 2);
    ctx.stroke();
  };
  ctx.globalCompositeOperation = "lighter";
  rimArc(-3.5, "rgba(255, 60, 70, 0.35)", 5);
  rimArc(0, "rgba(60, 255, 190, 0.5)", 5);
  rimArc(3.5, "rgba(70, 90, 255, 0.35)", 5);

  // Specular key light.
  const spec = ctx.createRadialGradient(half * 1.28, half * 0.42, 1, half * 1.28, half * 0.42, half * 0.32);
  spec.addColorStop(0, "rgba(255,255,255,0.95)");
  spec.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = spec;
  ctx.beginPath();
  ctx.arc(half * 1.28, half * 0.42, half * 0.32, 0, Math.PI * 2);
  ctx.fill();

  // Violet fill from the opposite side, echoing scene lighting.
  const fill = ctx.createRadialGradient(half * 0.4, half * 1.35, 1, half * 0.4, half * 1.35, half * 0.6);
  fill.addColorStop(0, "rgba(139, 92, 246, 0.55)");
  fill.addColorStop(1, "rgba(139, 92, 246, 0)");
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(half * 0.4, half * 1.35, half * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;

  cached = {
    matcap: tex,
    dispose: () => {
      tex.dispose();
      cached = null;
    },
  };
  return cached;
}

/** Topic-safe dispose for unmounts that reach the matcap tier. */
export function disposeCrystalTextures(): void {
  cached?.dispose();
}
