"use client";

import React, { useEffect, useRef } from "react";

export const ContourCursorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 3;
    let targetX = mouseX;
    let targetY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Number of animated contour rings
    const rings = 14;

    const render = () => {
      // Smooth interpolation for cursor follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const baseColor = isDark ? "rgba(244, 239, 230, " : "rgba(31, 77, 58, ";

      ctx.lineWidth = 1;

      for (let i = 1; i <= rings; i++) {
        const radius = i * 45;
        const opacity = Math.max(0.015, (1 - i / rings) * 0.09);
        ctx.strokeStyle = `${baseColor}${opacity})`;

        ctx.beginPath();
        const steps = 64;
        for (let s = 0; s <= steps; s++) {
          const angle = (s / steps) * Math.PI * 2;
          // Subtle harmonic wave distortion based on cursor and angle
          const distortion =
            Math.sin(angle * 3 + i * 0.6) * 12 +
            Math.cos(angle * 5 - i * 0.4) * 8;
          const r = radius + distortion;
          const x = mouseX + Math.cos(angle) * r;
          const y = mouseY + Math.sin(angle) * (r * 0.65); // elliptical cartographic projection

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
