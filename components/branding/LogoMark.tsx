import React from "react";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = "", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`inline-block shrink-0 ${className}`}
    >
      {/* Irregular Cadastral Parcel Polygon */}
      {/* Vertices: A(5, 7), B(24, 4), C(28, 23), D(14, 28), E(6, 22) */}
      <polygon
        points="5,7 24,4 28,23 14,28 6,22"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* The Signature Forest Green Highlighted Boundary Edge (A -> B) */}
      <line
        x1="5"
        y1="7"
        x2="24"
        y2="4"
        stroke="#1F4D3A"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Vertex Cadastral Corner Pins */}
      <circle cx="5" cy="7" r="1.5" fill="#1F4D3A" />
      <circle cx="24" cy="4" r="1.5" fill="#1F4D3A" />
      <circle cx="28" cy="23" r="1.2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="14" cy="28" r="1.2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="6" cy="22" r="1.2" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
};
