import React from 'react';

interface CrtScreenShaderProps {
  isEnabled: boolean;
}

/**
 * 1999 CRT / VHS Tube Television Screen Shader
 * Delivers retro tube television immersion:
 * 1. Microscopic scanlines (tight 1.5px interlace)
 * 2. Convex tube curvature vignette at corners
 * 3. Optical chromatic aberration (color fringing at far edges)
 * 4. Aperture grille phosphor subpixel tint
 * 5. Subtle VHS tape tracking roll line
 */
export const CrtScreenShader: React.FC<CrtScreenShaderProps> = ({ isEnabled }) => {
  if (!isEnabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[45] overflow-hidden select-none"
      data-testid="crt-screen-shader"
      aria-hidden="true"
    >
      {/* 1. Microscopic Scanlines Layer */}
      <div className="absolute inset-0 crt-micro-scanlines opacity-75" />

      {/* 2. Aperture Grille Phosphor Subpixels */}
      <div className="absolute inset-0 crt-aperture-grille opacity-45 mix-blend-overlay" />

      {/* 3. Convex Tube Vignette & Corner Bulge Shading */}
      <div className="absolute inset-0 crt-tube-vignette" />

      {/* 4. Chromatic Aberration Fringe (Color fringing on far edges) */}
      <div className="crt-chromatic-fringe" />

      {/* 5. Subtle TV Tube Glass Edge Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.015] pointer-events-none" />
    </div>
  );
};
