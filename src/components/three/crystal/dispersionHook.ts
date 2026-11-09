"use client";

import * as THREE from "three";

/**
 * GLSL injection hooks for the refractive crystal material.
 *
 * Physical dispersion (per-channel IOR sampling of the transmission buffer)
 * and the mipmapped-roughness transmission blur ship inside three.js's
 * MeshPhysicalMaterial, so we do NOT rewrite that pipeline. Instead we hook
 * onBeforeCompile to add the optical effects three.js leaves out:
 *
 *  - a Fresnel-weighted rim at grazing angles with per-channel dispersion
 *    spread (chromatic aberration biased to the optical edge of the facet),
 *  - rim hue/angle modulation driven by the tilt state (the refraction and
 *    highlight angle respond to cursor / gyroscope),
 *  - a clearcoat-level sparkle modulator that keeps facets alive while the
 *    crystal rotates.
 */

export interface CrystalShaderUniforms {
  uTiltX: { value: number };
  uTiltY: { value: number };
  uRimColor: { value: THREE.Color };
  uRimStrength: { value: number };
  /** Sterength of the per-channel chromatic spread at the rim. */
  uDispersionRim: { value: number };
  /** Fresnel exponent: higher = tighter edge falloff. */
  uRimFresnel: { value: number };
}

export function createCrystalUniforms(): CrystalShaderUniforms {
  return {
    uTiltX: { value: 0 },
    uTiltY: { value: 0 },
    uRimColor: { value: new THREE.Color("#b7fff2") },
    uRimStrength: { value: 0.55 },
    uDispersionRim: { value: 0.85 },
    uRimFresnel: { value: 2.6 },
  };
}

/**
 * Attach the rim-dispersion hook to a MeshPhysicalMaterial. Shared uniforms
 * are update per frame by the scene. Returns the uniforms record so callers
 * can mutate values without touching the material.
 */
export function attachCrystalHook(
  material: THREE.MeshPhysicalMaterial,
  uniforms: CrystalShaderUniforms
): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTiltX = uniforms.uTiltX;
    shader.uniforms.uTiltY = uniforms.uTiltY;
    shader.uniforms.uRimColor = uniforms.uRimColor;
    shader.uniforms.uRimStrength = uniforms.uRimStrength;
    shader.uniforms.uDispersionRim = uniforms.uDispersionRim;
    shader.uniforms.uRimFresnel = uniforms.uRimFresnel;

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uTiltX;
uniform float uTiltY;
uniform vec3 uRimColor;
uniform float uRimStrength;
uniform float uDispersionRim;
uniform float uRimFresnel;`
      )
      // Land right after the builtin physically-based transmission block:
      // geometryNormal / geometryViewDir are still in scope here.
      .replace(
        "#include <transmission_fragment>",
        `#include <transmission_fragment>

// MDC crystal rim dispersion hook
vec3 mdcV = geometryViewDir;
float mdcEdge = saturate( 1.0 - abs( dot( geometryNormal, mdcV ) ) );
float mdcFresnel = pow( mdcEdge, uRimFresnel );

// Optical-bias chromatic spread: red is refracted hardest at grazing edges,
// and the spread axis rotates with the pointer / gyro tilt.
float mdcSpread = uDispersionRim * mdcEdge * ( 0.5 * uTiltX - 0.35 * uTiltY );
vec3 mdcChroma = vec3(
  1.0 + mdcSpread,
  1.0 - 0.35 * mdcSpread,
  1.0 - 0.7 * mdcSpread
);

// Fresnel rim behaves like a thin-film edge reflection; also feed a sliver
// into totalDiffuse so transmission alpha picks up chromatic bleed.
vec3 mdcRim = uRimColor * mdcChroma * mdcFresnel * uRimStrength;
totalSpecular += mdcRim;
totalDiffuse += mdcRim * ( 1.0 - saturate( abs( mdcSpread ) ) );`
      )
      .replace(
        "#include <opaque_fragment>",
        // Subtle inner shimmer that follows tilt, layered beneath transmission.
        `outgoingLight += uRimColor * ( 0.035 + 0.025 * uTiltY + 0.02 * uTiltX );
#include <opaque_fragment>`
      );
  };
  // Stable cache key: never shares a compiled program with the plain material.
  material.customProgramCacheKey = () => "mdc-crystal-rim-dispersion-v1";
}

/** Detach the hook (used before swapping to the matcap fallback material). */
export function detachCrystalHook(material: THREE.Material): void {
  material.onBeforeCompile = (shader) => shader.toString();
  material.customProgramCacheKey = () => "mdc-neutral";
}
