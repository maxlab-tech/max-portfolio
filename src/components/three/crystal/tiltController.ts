"use client";

/**
 * Pointer + gyroscope driven inertial tilt controller.
 *
 * Desktop: window pointermove maps cursor position to a normalized target tilt
 * in the [-1, 1] range. Mobile: deviceorientation (gamma / beta) is used when
 * available (iOS requires a runtime permission request, exposed separately).
 *
 * Tilt values are advanced with a critically damped spring per axis, which
 * gives a fluid lerp with real inertia instead of a plain exponential ease.
 * update(dt) MUST be called every scene frame; dispose() removes listeners.
 */

export interface TiltState {
  /** Current smoothed tilt, x and y in [-1, 1]. */
  valueX: number;
  valueY: number;
  /** True once any input source has delivered data. */
  hasInput: boolean;
  /** True when a deviceorientation handler has reported motion data. */
  gyroActive: boolean;
}

const POINTER_EDGE_MARGIN = 0.08;

export class TiltController {
  private targetX = 0;
  private targetY = 0;
  private velX = 0;
  private velY = 0;
  private readonly stiffness: number;
  private readonly damping: number;
  private readonly state: TiltState = { valueX: 0, valueY: 0, hasInput: false, gyroActive: false };

  private pointerListener: ((e: PointerEvent) => void) | null = null;
  private gyroListener: ((e: DeviceOrientationEvent) => void) | null = null;

  constructor(smoothing = 6) {
    // Critically damped spring: stiffness / damping tuned so the crystal
    // settles in roughly 0.4s while overshooting slightly (fluid follow).
    this.stiffness = smoothing * 2.2;
    this.damping = Math.sqrt(this.stiffness * 4);
    if (typeof window !== "undefined") {
      this.pointerListener = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        // Small dead zone at the extreme edges to avoid hard clipping.
        const mx = 1 + POINTER_EDGE_MARGIN;
        const my = 1 + POINTER_EDGE_MARGIN;
        this.targetX = Math.max(-mx, Math.min(mx, nx)) ;
        this.targetY = Math.max(-my, Math.min(my, ny)) - 0.15;
        this.state.hasInput = true;
      };
      window.addEventListener("pointermove", this.pointerListener, { passive: true });
    }
  }

  /** Attach gyroscope tilt (call after any iOS permission request succeeds). */
  attachGyro(): void {
    if (typeof window === "undefined" || this.gyroListener) return;
    this.gyroListener = (e: DeviceOrientationEvent) => {
      if (e.gamma == null && e.beta == null) return;
      // Landscape-sensitive mapping: use screen orientation to pick the axis.
      const landscape =
        typeof screen !== "undefined" &&
        (screen.orientation?.type.startsWith("landscape") ?? false);
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      const portraitGamma = landscape ? 0 : gamma;
      const portraitBeta = landscape ? -gamma : beta;
      this.targetX = Math.max(-1, Math.min(1, portraitGamma / 30));
      this.targetY = Math.max(-1, Math.min(1, (portraitBeta - 35) / 30));
      this.state.hasInput = true;
      this.state.gyroActive = true;
    };
    window.addEventListener("deviceorientation", this.gyroListener, { passive: true });
  }

  detachGyro(): void {
    if (this.gyroListener) {
      window.removeEventListener("deviceorientation", this.gyroListener);
      this.gyroListener = null;
      this.state.gyroActive = false;
    }
  }

  /** Request iOS motion permission. Resolves true if granted or not needed. */
  static async requestGyroPermission(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const api = (
      window as unknown as {
        DeviceOrientationEvent?: { requestPermission?: () => Promise<"granted" | "denied"> };
      }
    ).DeviceOrientationEvent;
    if (!api) return false;
    if (typeof api.requestPermission !== "function") return true;
    try {
      const res = await api.requestPermission();
      return res === "granted";
    } catch {
      return false;
    }
  }

  get(): TiltState {
    return this.state;
  }

  /** Advance the inertial spring. Call once per frame with seconds delta. */
  update(dt: number): void {
    const clamped = Math.min(dt, 0.05);
    // Semi-implicit spring integration (_exp stability for variable dt).
    this.velX += (this.targetX - this.state.valueX) * this.stiffness * clamped;
    this.velY += (this.targetY - this.state.valueY) * this.stiffness * clamped;
    const decay = Math.exp(-this.damping * clamped);
    this.velX *= decay;
    this.velY *= decay;
    this.state.valueX += this.velX * clamped;
    this.state.valueY += this.velY * clamped;
  }

  /** Nudge the target faster (used when the pointer leaves / resumes). */
  resetTo(x = 0, y = 0): void {
    this.targetX = x;
    this.targetY = y;
  }

  dispose(): void {
    if (this.pointerListener) {
      window.removeEventListener("pointermove", this.pointerListener);
      this.pointerListener = null;
    }
    this.detachGyro();
  }
}
