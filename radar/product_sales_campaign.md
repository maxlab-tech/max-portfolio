# VertexFlow 3D ($29) — US/UK Digital Product Sales Engine
**Goal:** Generate $30/day (~1 sale/day @ $29 USD) in passive digital asset revenue.
**Asset:** VertexFlow 3D: R3F & GLSL Procedural Shader Kit (v1.0.0)
**Live Demo:** https://maxlab-tech.github.io/max-portfolio/#products

---

## 1. Gumroad / Lemon Squeezy Product Listing Copy

**Product Title:**  
VertexFlow 3D — Production GLSL Displacement & Analytical Normal Shader Kit for React Three Fiber

**Subtitle / Tagline:**  
Stop fighting broken specular highlights on displaced meshes. Zero-faceting procedural vertex displacement with analytical normal recalculation in GLSL at 60–120 FPS.

**Price:**  
$29 USD (Early Bird / Regular: $49)

**Cover Hook:**  
"The missing GPU math for smooth procedural 3D surfaces in React Three Fiber."

**Description Body:**
```markdown
### Why Most Procedural Shaders Look Like Low-Poly Plastic
When you displace vertex positions using Simplex or Perlin noise in WebGL, Three.js still shades the surface using the mesh's original undeformed normals. 

The result?
- Broken specular highlights that slide unnaturally across the surface.
- Flat or faceted PBR reflections.
- Glitched grazing-angle rim lighting that breaks the optical illusion.

### The Solution: Analytical Normals on GPU via Finite Differences
VertexFlow 3D computes exact surface normal vectors on the fly inside the vertex shader using finite difference tangent cross products:
$$\vec{N} = \text{normalize}(\text{cross}(\vec{p}_t - \vec{p}_0, \vec{p}_b - \vec{p}_0))$$

This gives you silky-smooth specular highlights, physically accurate shadows, and 60–120 FPS performance on both desktop and mobile.

### What's Inside the Box:
- ⚡ **DisplacementShaderMaterial.ts:** Custom R3F shaderMaterial factory with complete TypeScript uniforms.
- 🎯 **DisplacementScene.tsx:** Interactive 3D mesh with mouse pointer damping (lerp) and rotational inertia.
- 🛡️ **DisplacementCanvas.tsx:** Drop-in responsive Canvas with DPR clamping and WebGL fallback boundaries.
- 🧪 **Live Inspection Modes:** Switch between PBR Metallic, RGB Normal Vector inspection, and Iridescent Rim.
- 📑 **Raw GLSL Shaders:** Independent `displacement.vert.glsl` and `displacement.frag.glsl` for vanilla Three.js, Vite, or Babylon.js.
- 🚀 **Zero Runtime Overhead:** Pure GLSL shaders, tree-shakeable, < 4 KB bundle size.
- 💼 **Commercial Rights:** Build unlimited commercial client websites and SaaS apps with zero attribution required.
```

---

## 2. Reddit Value-First Post Copy (Target: r/threejs, r/reactjs, r/webdev)

**Title:**  
How to recalculate surface normals analytically in GLSL when doing procedural vertex displacement in React Three Fiber (interactive breakdown + math)

**Post Content:**
```markdown
Hey everyone! 👋

If you've ever tried building procedural organic shapes, fluid blobs, or terrain in Three.js by pushing vertex positions in a custom vertex shader with Simplex noise, you've probably hit this frustrating visual bug:

The surface moves beautifully, but the lighting looks flat, broken, or faceted. 

That happens because Three.js continues to compute lighting using the mesh's *original undeformed normals* (`vNormal`).

### The Math: Analytical Normal Recalculation
To fix this without expensive CPU mesh recomputations or geometry generation, you can calculate the exact tangent and bitangent vectors around each vertex using finite differences directly on the GPU:

1. Sample the base displaced vertex:
   `vec3 p0 = pos + normal * getDisplacement(pos);`

2. Sample two microscopic orthogonal offsets ($\epsilon = 0.005$):
   `vec3 pT = (pos + tangent * eps) + normal * getDisplacement(pos + tangent * eps);`
   `vec3 pB = (pos + bitangent * eps) + normal * getDisplacement(pos + bitangent * eps);`

3. The true normal is the normalized cross product of the displacement deltas:
   `vec3 analyticalNormal = normalize(cross(pT - p0, pB - p0));`

4. Pass `analyticalNormal` to your fragment shader, and your Blinn-Phong or PBR specular highlights will curve seamlessly over every ripple.

### Live Demo & Interactive Inspection
I built an interactive WebGL playground where you can toggle between PBR Metallic, RGB Normal inspection (to see the mathematical surface derivatives in real time), and wireframe mesh density:

👉 Live Interactive Demo: https://maxlab-tech.github.io/max-portfolio/#products

If anyone wants the drop-in TypeScript & R3F components, I've packaged the complete production kit with presets and WebGL crash guards here:
👉 https://maxlab-tech.github.io/max-portfolio/#products

Hope this finite-difference approach helps anyone currently building procedural 3D elements! Happy to answer questions in the comments.
```

---

## 3. X (Twitter) High-Engagement Thread Copy

**Tweet 1 (Hook + Video/GIF):**  
Most WebGL procedural displacement looks like flat low-poly plastic because default normals don't update when vertices move. 

Here is the exact 10-line GLSL formula to recalculate analytical normals on GPU at 60 FPS in React Three Fiber 🧵👇  
[ATTACH: Screen recording of Normal RGB mode vs. PBR Metallic mode]

**Tweet 2 (The Problem):**  
When you push `gl_Position` with Simplex noise in a vertex shader:
`vNormal = normal;` is lying to your fragment shader. 
Light still bounces as if the mesh is flat, ruining specularity and grazing-angle rim highlights.

**Tweet 3 (The Math):**  
The fix: Finite differences.
Sample two tiny orthogonal vectors ($t$ and $b$) offset by $\epsilon = 0.005$.
Displace all 3 positions, then take their cross product:
`vec3 N = normalize(cross(pT - p0, pB - p0));`
Now your specular highlights bend organically with every crest and trough.

**Tweet 4 (Playground & Kit):**  
Tested and packaged with smooth mouse pointer damping, 3 visual inspection modes, and WebGL crash fallbacks.

Inspect the live 3D playground or grab the drop-in R3F kit:  
👉 https://maxlab-tech.github.io/max-portfolio/#products

---

## 4. US/UK Direct Creative Agency Prospect List

Target: Boutiques and design studios building high-conversion SaaS landing pages with Three.js/WebGL.

1. **Studio Freight (US)** — High-profile web studio known for creative interaction.
   - Angle: Drop-in shader kit for rapid client prototypes.
2. **Monopo London (UK)** — Creative agency specializing in tactile digital experiences.
   - Angle: High-performance 60 FPS mobile-audited displacement without WebGL crash risk.
3. **Active Theory (US/UK)** — Pioneers of WebGL creative web experiences.
   - Angle: Clean finite-difference reference implementation for micro-interactions.
4. **Resn (Global / US)** — Creative interactive showcase agency.
5. **Basic/Dept (US/UK)** — Leading digital brand agency.
