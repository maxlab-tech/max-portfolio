import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

/**
 * Custom GLSL Vertex Displacement & Analytical Normal Recalculation
 * 
 * Mathematical Principle:
 * When vertex positions are displaced along procedural noise vectors, the default
 * mesh normals (vNormal) become invalid, causing broken specular reflections.
 * We recalculate analytical surface normals in the vertex shader via finite differences:
 * Evaluates orthogonal tangent (vT) and bitangent (vB) vectors at delta epsilon (eps),
 * yielding the exact surface normal N = normalize(cross(vT, vB)).
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uNoiseFreq;
  uniform float uNoiseAmp;
  uniform vec2 uPointer;
  uniform float uPointerRadius;
  uniform float uPointerStrength;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vModelPosition;
  varying vec2 vUv;
  varying float vDisplacement;

  // --- Ashima Arts / Stefan Gustavson Simplex 3D Noise ---
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z.xxxx);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p_0 = vec3(a0.xy, h.x);
    vec3 p_1 = vec3(a0.zw, h.y);
    vec3 p_2 = vec3(a1.xy, h.z);
    vec3 p_3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p_0, p_0), dot(p_1, p_1), dot(p_2, p_2), dot(p_3, p_3)));
    p_0 *= norm.x;
    p_1 *= norm.y;
    p_2 *= norm.z;
    p_3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p_0, x0), dot(p_1, x1), dot(p_2, x2), dot(p_3, x3)));
  }

  // Displacement function combining procedural noise + pointer wave
  float calculateDisplacement(vec3 pos) {
    // Multi-octave harmonic noise
    float n1 = snoise(pos * uNoiseFreq + vec3(0.0, uTime * 0.4, 0.0));
    float n2 = snoise(pos * (uNoiseFreq * 2.1) - vec3(uTime * 0.25, 0.0, uTime * 0.3)) * 0.45;
    float baseDisplacement = (n1 + n2) * uNoiseAmp;

    // Interactive pointer ripple
    vec2 posProj = pos.xy;
    float d = distance(posProj, uPointer);
    float pointerWave = sin(d * 14.0 - uTime * 6.0) * exp(-d / uPointerRadius) * uPointerStrength;

    return baseDisplacement + pointerWave;
  }

  vec3 getOrthogonal(vec3 n) {
    vec3 up = abs(n.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    return normalize(cross(n, up));
  }

  void main() {
    vUv = uv;
    vModelPosition = position;

    // 1. Compute orthogonal basis on the tangent space
    vec3 t = getOrthogonal(normal);
    vec3 b = normalize(cross(normal, t));

    // 2. Finite difference delta epsilon
    float eps = 0.005;

    // 3. Compute displaced positions for center, tangent offset, bitangent offset
    float disp0 = calculateDisplacement(position);
    float dispT = calculateDisplacement(position + t * eps);
    float dispB = calculateDisplacement(position + b * eps);

    vec3 p0 = position + normal * disp0;
    vec3 pT = (position + t * eps) + normal * dispT;
    vec3 pB = (position + b * eps) + normal * dispB;

    // 4. Analytical surface normal via cross product of tangent vectors
    vec3 vT = pT - p0;
    vec3 vB = pB - p0;
    vec3 analyticalNormal = normalize(cross(vT, vB));

    // Handle normal direction flip if backface or negative cross
    if (dot(analyticalNormal, normal) < 0.0) {
      analyticalNormal = -analyticalNormal;
    }

    vNormal = normalize(normalMatrix * analyticalNormal);
    vDisplacement = disp0;

    vec4 worldPos = modelMatrix * vec4(p0, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform int uRenderMode; // 0 = Metallic PBR, 1 = Analytical Normal Inspection, 2 = Iridescent Rim
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform vec3 uColorHighlight;
  uniform vec3 uLightPos;
  uniform float uRoughness;
  uniform float uMetalness;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vModelPosition;
  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    vec3 L = normalize(uLightPos - vWorldPosition);
    vec3 H = normalize(L + V);

    // MODE 1: Analytical Normal Vector Inspection (RGB debug mode)
    if (uRenderMode == 1) {
      vec3 normalColor = N * 0.5 + 0.5;
      gl_FragColor = vec4(normalColor, 1.0);
      return;
    }

    // MODE 2: Iridescent Optical Dispersion
    if (uRenderMode == 2) {
      float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
      vec3 spectral = vec3(
        sin(fresnel * 6.28 + 0.0) * 0.5 + 0.5,
        sin(fresnel * 6.28 + 2.09) * 0.5 + 0.5,
        sin(fresnel * 6.28 + 4.18) * 0.5 + 0.5
      );
      vec3 col = mix(uColorBase, spectral, fresnel);
      col += vec3(pow(max(dot(N, H), 0.0), 40.0)) * 0.6;
      gl_FragColor = vec4(col, 0.95);
      return;
    }

    // MODE 0: Physically-based Metallic Reflection with Blinn-Phong & Fresnel
    float NdotL = max(dot(N, L), 0.0);
    float NdotH = max(dot(N, H), 0.0);
    float NdotV = max(dot(N, V), 0.0);

    // Dynamic color gradient driven by displacement depth
    float dispFactor = smoothstep(-0.25, 0.35, vDisplacement);
    vec3 surfaceColor = mix(uColorBase, uColorAccent, dispFactor);

    // Diffuse & Ambient
    vec3 ambient = surfaceColor * 0.15;
    vec3 diffuse = surfaceColor * NdotL * (1.0 - uMetalness * 0.6);

    // Specular Highlight (analytical normal ensures sharp, coherent highlights)
    float shininess = mix(20.0, 180.0, 1.0 - uRoughness);
    float spec = pow(NdotH, shininess);
    vec3 specular = mix(vec3(0.04), surfaceColor, uMetalness) * spec * 1.5;

    // Grazing angle Fresnel Rim Light
    float fresnel = pow(1.0 - NdotV, 3.5);
    vec3 rim = uColorHighlight * fresnel * 0.8;

    vec3 finalColor = ambient + diffuse + specular + rim;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const DisplacementShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uNoiseFreq: 1.2,
    uNoiseAmp: 0.28,
    uPointer: new THREE.Vector2(0, 0),
    uPointerRadius: 0.8,
    uPointerStrength: 0.35,
    uRenderMode: 0,
    uColorBase: new THREE.Color("#070d18"),
    uColorAccent: new THREE.Color("#00d4aa"),
    uColorHighlight: new THREE.Color("#8b5cf6"),
    uLightPos: new THREE.Vector3(3.0, 4.0, 5.0),
    uRoughness: 0.25,
    uMetalness: 0.75,
  },
  vertexShader,
  fragmentShader
);
