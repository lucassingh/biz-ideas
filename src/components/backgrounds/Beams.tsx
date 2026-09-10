"use client";

import { Camera, Geometry, Mesh, Program, Renderer, Transform } from "ogl";
import { useEffect, useRef } from "react";

/**
 * Adapted from react-bits' Beams background
 * (https://reactbits.dev/backgrounds/beams) — noise-displaced vertical beam
 * strips lit by a directional light. Upstream builds this on
 * @react-three/fiber + drei, extending Three's PBR "physical" shader
 * (MeshStandardMaterial) for the lighting. Porting that whole pipeline would
 * mean adding three + @react-three/fiber + @react-three/drei as new
 * dependencies — a much bigger addition than the rest of this project's
 * WebGL, which is all plain OGL. Since the light here is a single fixed
 * directional light with no shadows, a hand-rolled Lambertian term (N·L
 * against a fixed light direction) reproduces the same shape/shading signal
 * without the PBR machinery — the noise-driven vertex displacement and
 * fragment dithering are copied verbatim (those are just GLSL math, not
 * Three-specific). Pauses itself off-screen or when the tab is hidden,
 * matching Grainient's lifecycle.
 */

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  beamColor?: string;
  backgroundColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  lightMode?: boolean;
  className?: string;
}

const hexToRgb01 = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "");
  return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255];
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;

// Same layout as upstream's createStackedPlanesBufferGeometry: `count` vertical
// strips side by side, each subdivided into `heightSegments` quads so the vertex
// shader has enough resolution to bend along its length.
function buildBeamsGeometry(count: number, width: number, height: number, heightSegments: number) {
  const numVertices = count * (heightSegments + 1) * 2;
  const numFaces = count * heightSegments * 2;
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(numFaces * 3);

  let vertexOffset = 0;
  let indexOffset = 0;
  let uvOffset = 0;
  const totalWidth = count * width;
  const xOffsetBase = -totalWidth / 2;

  for (let i = 0; i < count; i++) {
    const xOffset = xOffsetBase + i * width;
    const uvXOffset = Math.random() * 300;
    const uvYOffset = Math.random() * 300;

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5);
      positions.set([xOffset, y, 0, xOffset + width, y, 0], vertexOffset * 3);

      const uvY = j / heightSegments;
      uvs.set([uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset], uvOffset);

      if (j < heightSegments) {
        const a = vertexOffset;
        const b = vertexOffset + 1;
        const c = vertexOffset + 2;
        const d = vertexOffset + 3;
        indices.set([a, b, c, c, b, d], indexOffset);
        indexOffset += 6;
      }
      vertexOffset += 2;
      uvOffset += 4;
    }
  }

  return { positions, uvs, indices };
}

const classicNoiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`;

const vertex = `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
varying vec3 vNormal;

${classicNoiseGLSL}

float getPos(vec3 pos) {
  vec3 noisePos = vec3(pos.x * 0.0, pos.y - uv.y, pos.z + uTime * uSpeed * 3.0) * uScale;
  return cnoise(noisePos);
}
vec3 getCurrentPos(vec3 pos) {
  vec3 newpos = pos;
  newpos.z += getPos(pos);
  return newpos;
}
vec3 getObjectNormal(vec3 pos) {
  vec3 curpos = getCurrentPos(pos);
  vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
  vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
  vec3 tangentX = normalize(nextposX - curpos);
  vec3 tangentZ = normalize(nextposZ - curpos);
  return normalize(cross(tangentZ, tangentX));
}

void main() {
  vec3 transformed = position;
  transformed.z += getPos(position);
  vNormal = normalize(normalMatrix * getObjectNormal(position));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragment = `
precision highp float;
uniform vec3 uDiffuse;
uniform vec3 uLightColor;
uniform vec3 uLightDir;
uniform float uAmbient;
uniform float uNoiseIntensity;
uniform float uLightMode;
varying vec3 vNormal;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec3 n = normalize(vNormal);
  float diffuseTerm = max(dot(n, normalize(uLightDir)), 0.0);
  vec3 col = uDiffuse * uLightColor * (uAmbient + diffuseTerm * (1.0 - uAmbient));

  float grain = random(gl_FragCoord.xy);
  col -= grain / 15.0 * uNoiseIntensity;

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    vec3 chroma = clamp(col / max(energy, 0.0001), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.2));
    col = mix(vec3(1.0), chroma, clamp(energy * 0.98, 0.0, 0.94));
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

const Beams: React.FC<BeamsProps> = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  beamColor = "#000000",
  backgroundColor = "#000000",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
  lightMode = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), antialias: true });
    const gl = renderer.gl;
    const [bgR, bgG, bgB] = hexToRgb01(backgroundColor);
    gl.clearColor(bgR, bgG, bgB, 1);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const camera = new Camera(gl, { fov: 30, near: 0.1, far: 100 });
    camera.position.set(0, 0, 20);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();
    const beamsGroup = new Transform();
    beamsGroup.rotation.z = degToRad(rotation);
    beamsGroup.setParent(scene);

    const { positions, uvs, indices } = buildBeamsGeometry(beamNumber, beamWidth, beamHeight, 100);
    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      uv: { size: 2, data: uvs },
      index: { data: indices },
    });

    const lightDir = [0, 3, 10] as [number, number, number];
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uDiffuse: { value: new Float32Array(hexToRgb01(beamColor)) },
        uLightColor: { value: new Float32Array(hexToRgb01(lightColor)) },
        uLightDir: { value: new Float32Array(lightDir) },
        uAmbient: { value: 0.4 },
        uNoiseIntensity: { value: noiseIntensity },
        uLightMode: { value: lightMode ? 1 : 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(beamsGroup);

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let lastTime = performance.now();

    const loop = (t: number) => {
      const delta = Math.min(0.1, (t - lastTime) / 1000);
      lastTime = t;
      program.uniforms.uTime.value += 0.1 * delta;
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) {
        lastTime = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      try {
        container.removeChild(canvas);
      } catch {
        /* ignore */
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [beamWidth, beamHeight, beamNumber, lightColor, beamColor, backgroundColor, speed, noiseIntensity, scale, rotation, lightMode]);

  return <div ref={containerRef} className={`h-full w-full ${className}`.trim()} />;
};

export default Beams;
