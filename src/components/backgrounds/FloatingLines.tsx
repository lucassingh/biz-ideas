"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

/**
 * Adapted from react-bits' FloatingLines background
 * (https://reactbits.dev/backgrounds/floating-lines) — thin glowing wave
 * strokes drifting across three layers, mostly-transparent between the
 * lines themselves, which reads as a much sparser accent than a noise-band
 * wash. Ported from the upstream Three.js version to OGL (this project's
 * WebGL library, already used by Grainient/Ferrofluid) rather than adding a
 * second 3D dependency: the fullscreen-triangle + gl_FragCoord approach is
 * framework-agnostic, so the shader logic carries over as-is. Two
 * simplifications from upstream: `uniform bool` became `uniform float`
 * compared with `> 0.5`
 * (matching this project's other OGL shaders — kept OGL's simpler
 * uniform-setter dictionary happy), and the 8-stop gradient
 * array became a plain 2-color mix across each wave's lines (this project
 * only ever needs a 2-tone brand-blue gradient, and per-instance array
 * uniforms are one more thing that can silently misbehave across GPUs).
 * Colors are passed in as hex props by the caller, driven by our theme
 * tokens; pauses itself off-screen or when the tab is hidden, matching
 * Grainient's lifecycle.
 */

type WaveKey = "top" | "middle" | "bottom";
type WavePosition = { x: number; y: number; rotate: number };

interface FloatingLinesProps {
  color1?: string;
  color2?: string;
  enabledWaves?: WaveKey[];
  lineCount?: number;
  lineDistance?: number;
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  lightMode?: boolean;
  className?: string;
}

const MAX_LINES = 10;

const hexToVec3 = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
};

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float uSpeed;

uniform float uEnableTop;
uniform float uEnableMiddle;
uniform float uEnableBottom;

uniform int uTopCount;
uniform int uMiddleCount;
uniform int uBottomCount;

uniform float uTopDistance;
uniform float uMiddleDistance;
uniform float uBottomDistance;

uniform vec3 uTopPos;
uniform vec3 uMiddlePos;
uniform vec3 uBottomPos;

uniform vec2 uMouse;
uniform float uInteractive;
uniform float uBendRadius;
uniform float uBendStrength;
uniform float uBendInfluence;

uniform float uParallax;
uniform vec2 uParallaxOffset;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uLightMode;

#define MAX_LINES ${MAX_LINES}

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 lineColor(float t) {
  return mix(uColor1, uColor2, clamp(t, 0.0, 1.0)) * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, float shouldBend) {
  float time = iTime * uSpeed;

  float x_movement = time * 0.1;
  float amp = sin(offset + time * 0.2) * 0.3;
  float y = sin(uv.x + offset + x_movement) * amp;

  if (shouldBend > 0.5) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * uBendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * uBendStrength * uBendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void main() {
  vec2 baseUv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  if (uParallax > 0.5) baseUv += uParallaxOffset;

  vec3 col = vec3(0.0);

  vec2 mouseUv = vec2(0.0);
  if (uInteractive > 0.5) {
    mouseUv = (2.0 * uMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (uEnableBottom > 0.5) {
    for (int i = 0; i < MAX_LINES; i++) {
      if (i >= uBottomCount) break;
      float fi = float(i);
      float t = fi / max(float(uBottomCount - 1), 1.0);
      float angle = uBottomPos.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineColor(t) * wave(
        ruv + vec2(uBottomDistance * fi + uBottomPos.x, uBottomPos.y),
        1.5 + 0.2 * fi, baseUv, mouseUv, uInteractive
      ) * 0.2;
    }
  }

  if (uEnableMiddle > 0.5) {
    for (int i = 0; i < MAX_LINES; i++) {
      if (i >= uMiddleCount) break;
      float fi = float(i);
      float t = fi / max(float(uMiddleCount - 1), 1.0);
      float angle = uMiddlePos.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineColor(t) * wave(
        ruv + vec2(uMiddleDistance * fi + uMiddlePos.x, uMiddlePos.y),
        2.0 + 0.15 * fi, baseUv, mouseUv, uInteractive
      );
    }
  }

  if (uEnableTop > 0.5) {
    for (int i = 0; i < MAX_LINES; i++) {
      if (i >= uTopCount) break;
      float fi = float(i);
      float t = fi / max(float(uTopCount - 1), 1.0);
      float angle = uTopPos.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineColor(t) * wave(
        ruv + vec2(uTopDistance * fi + uTopPos.x, uTopPos.y),
        1.0 + 0.2 * fi, baseUv, mouseUv, uInteractive
      ) * 0.1;
    }
  }

  if (uLightMode > 0.5) {
    vec3 energy = max(col, vec3(0.0));
    float peak = max(energy.r, max(energy.g, energy.b));
    float coverage = smoothstep(0.018, 0.5, peak);
    vec3 chroma = clamp(energy / max(peak, 0.0001), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.35));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    vec3 ink = mix(chroma, clamp(chroma * 0.82, 0.0, 1.0), smoothstep(0.5, 1.0, coverage));
    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage * 0.94), coverage);
  } else {
    gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
  }
}
`;

const FloatingLines: React.FC<FloatingLinesProps> = ({
  color1 = "#3895D3",
  color2 = "#072F5F",
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = 6,
  lineDistance = 5,
  topWavePosition = { x: 10.0, y: 0.5, rotate: -0.4 },
  middleWavePosition = { x: 5.0, y: 0.0, rotate: 0.2 },
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: 0.4 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.08,
  parallax = true,
  parallaxStrength = 0.2,
  lightMode = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const dist = lineDistance * 0.01;
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: animationSpeed },
        uEnableTop: { value: enabledWaves.includes("top") ? 1 : 0 },
        uEnableMiddle: { value: enabledWaves.includes("middle") ? 1 : 0 },
        uEnableBottom: { value: enabledWaves.includes("bottom") ? 1 : 0 },
        uTopCount: { value: Math.min(MAX_LINES, lineCount) },
        uMiddleCount: { value: Math.min(MAX_LINES, lineCount) },
        uBottomCount: { value: Math.min(MAX_LINES, lineCount) },
        uTopDistance: { value: dist },
        uMiddleDistance: { value: dist },
        uBottomDistance: { value: dist },
        uTopPos: { value: new Float32Array([topWavePosition.x, topWavePosition.y, topWavePosition.rotate]) },
        uMiddlePos: {
          value: new Float32Array([middleWavePosition.x, middleWavePosition.y, middleWavePosition.rotate]),
        },
        uBottomPos: {
          value: new Float32Array([bottomWavePosition.x, bottomWavePosition.y, bottomWavePosition.rotate]),
        },
        uMouse: { value: new Float32Array([-1000, -1000]) },
        uInteractive: { value: interactive ? 1 : 0 },
        uBendRadius: { value: bendRadius },
        uBendStrength: { value: bendStrength },
        uBendInfluence: { value: 0 },
        uParallax: { value: parallax ? 1 : 0 },
        uParallaxOffset: { value: new Float32Array([0, 0]) },
        uColor1: { value: new Float32Array(hexToVec3(color1)) },
        uColor2: { value: new Float32Array(hexToVec3(color2)) },
        uLightMode: { value: lightMode ? 1 : 0 },
      },
    });

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
      (program.uniforms.iResolution.value as Float32Array).set([gl.canvas.width, gl.canvas.height]);
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const targetMouse: [number, number] = [-1000, -1000];
    const targetParallax: [number, number] = [0, 0];
    let targetInfluence = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dpr = renderer.dpr || 1;
      targetMouse[0] = x * dpr;
      targetMouse[1] = (rect.height - y) * dpr;
      targetInfluence = 1;

      if (parallax) {
        targetParallax[0] = ((x - rect.width / 2) / rect.width) * parallaxStrength;
        targetParallax[1] = (-(y - rect.height / 2) / rect.height) * parallaxStrength;
      }
    };
    const handlePointerLeave = () => {
      targetInfluence = 0;
    };
    if (interactive) {
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();
    let influence = 0;

    const loop = (t: number) => {
      program.uniforms.iTime.value = (t - t0) * 0.001;

      if (interactive) {
        const mouse = program.uniforms.uMouse.value as Float32Array;
        mouse[0] += (targetMouse[0] - mouse[0]) * mouseDamping;
        mouse[1] += (targetMouse[1] - mouse[1]) * mouseDamping;
        influence += (targetInfluence - influence) * mouseDamping;
        program.uniforms.uBendInfluence.value = influence;
      }
      if (parallax) {
        const offset = program.uniforms.uParallaxOffset.value as Float32Array;
        offset[0] += (targetParallax[0] - offset[0]) * mouseDamping;
        offset[1] += (targetParallax[1] - offset[1]) * mouseDamping;
      }

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
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
      if (interactive) {
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
      }
      try {
        container.removeChild(canvas);
      } catch {
        /* ignore */
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color1,
    color2,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    lightMode,
  ]);

  return <div ref={containerRef} className={`h-full w-full ${className}`.trim()} />;
};

export default FloatingLines;
