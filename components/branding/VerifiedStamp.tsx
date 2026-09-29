"use client";

import React from "react";
import { LogoMark } from "./LogoMark";

interface VerifiedStampProps {
  size?: "sm" | "md" | "lg";
  dateText?: string;
  lang?: "en" | "hi";
  animate?: boolean;
  className?: string;
}

export const VerifiedStamp: React.FC<VerifiedStampProps> = ({
  size = "md",
  dateText = "2026-09-29",
  lang = "en",
  animate = true,
  className = "",
}) => {
  const dimensions = {
    sm: { width: 90, height: 90, textRing: "text-[7px]", subText: "text-[6px]", logoSize: 22 },
    md: { width: 130, height: 130, textRing: "text-[10px]", subText: "text-[8px]", logoSize: 34 },
    lg: { width: 170, height: 170, textRing: "text-[12px]", subText: "text-[10px]", logoSize: 46 },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none text-surveyRed ${
        animate ? "animate-stamp" : ""
      } ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transformOrigin: "center center",
      }}
    >
      {/* Outer concentric rubber stamp ring */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
      >
        {/* Distressed double concentric ring */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="#B3372A"
          strokeWidth="2.2"
          strokeDasharray="98 2 45 1"
          opacity="0.9"
        />
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="#B3372A"
          strokeWidth="0.9"
          strokeDasharray="4 2"
          opacity="0.8"
        />

        {/* Top Arc Text Path */}
        <path
          id="textPathTop"
          d="M 18,50 A 32,32 0 1,1 82,50"
          fill="none"
        />
        {/* Bottom Arc Text Path */}
        <path
          id="textPathBottom"
          d="M 82,50 A 32,32 0 0,1 18,50"
          fill="none"
        />

        <text
          fill="#B3372A"
          className="font-mono font-bold tracking-[0.25em] uppercase text-[7.5px]"
        >
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            {lang === "hi" ? "• भू-अभिलेख सत्यापित •" : "• CADASTRAL VERIFIED •"}
          </textPath>
        </text>

        <text
          fill="#B3372A"
          className="font-mono font-semibold tracking-[0.18em] uppercase text-[6.5px]"
        >
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            {lang === "hi" ? `पायलट • ${dateText}` : `PILOT • ${dateText}`}
          </textPath>
        </text>
      </svg>

      {/* Center parcel polygon mark & stamp label */}
      <div className="flex flex-col items-center justify-center text-center z-10">
        <LogoMark size={dimensions.logoSize} className="text-surveyRed mb-0.5" />
        <span className="font-mono font-bold uppercase tracking-wider text-surveyRed text-[9px] leading-tight">
          {lang === "hi" ? "प्रमाणित" : "AUTHENTIC"}
        </span>
      </div>
    </div>
  );
};
