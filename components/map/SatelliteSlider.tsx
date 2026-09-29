"use client";

import React, { useState } from "react";
import { AlertCircle, Sliders, ShieldAlert, Sparkles, MapPin } from "lucide-react";

export const SatelliteSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [showEncroachment, setShowEncroachment] = useState(true);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[460px] bg-ink border border-hairline overflow-hidden select-none">
        
        {/* Base / "After" Image (2024 Drone / Satellite Imagery with construction) */}
        <div className="absolute inset-0 bg-[#344038] flex items-center justify-center">
          <div className="w-full h-full relative overflow-hidden bg-cover bg-center">
            {/* Procedural Cartographic Satellite Base Texture */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 800 500">
              <rect width="800" height="500" fill="#2E3B33" />
              {/* Field parcels */}
              <polygon points="120,80 340,70 310,240 100,220" fill="#3D4E43" stroke="#506657" strokeWidth="1" />
              <polygon points="340,70 560,60 540,250 310,240" fill="#465A4E" stroke="#506657" strokeWidth="1" />
              <polygon points="100,220 310,240 280,420 80,390" fill="#38493D" stroke="#506657" strokeWidth="1" />
              <polygon points="310,240 540,250 510,430 280,420" fill="#425547" stroke="#506657" strokeWidth="1" />
              
              {/* 2024 New Construction (Encroachment) */}
              <rect x="320" y="225" width="90" height="70" fill="#887D70" stroke="#B3372A" strokeWidth="2" />
              <text x="330" y="265" fill="#FFFFFF" fontSize="12" fontFamily="monospace">G+2 Shed</text>

              {/* Waterway / nullah */}
              <path d="M 50,0 Q 200,200 450,280 T 800,450" fill="none" stroke="#253540" strokeWidth="28" />
            </svg>

            {/* Label in top right */}
            <div className="absolute top-4 right-4 bg-paper/90 dark:bg-night-surface/90 border border-hairline px-3 py-1 font-mono text-xs text-ink dark:text-paper font-bold">
              Current Survey: September 2024 (Drone Post-Flight)
            </div>
          </div>
        </div>

        {/* Overlay / "Before" Image (2020 Historic Satellite Imagery) clipped by slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="w-[100vw] max-w-[1200px] h-full relative bg-[#2A352E]">
            <svg className="w-full h-full opacity-60" viewBox="0 0 800 500">
              <rect width="800" height="500" fill="#26332A" />
              {/* Historic fields: pristine open agricultural green */}
              <polygon points="120,80 340,70 310,240 100,220" fill="#334638" stroke="#485D4E" strokeWidth="1" />
              <polygon points="340,70 560,60 540,250 310,240" fill="#3A4D3F" stroke="#485D4E" strokeWidth="1" />
              <polygon points="100,220 310,240 280,420 80,390" fill="#2E4032" stroke="#485D4E" strokeWidth="1" />
              <polygon points="310,240 540,250 510,430 280,420" fill="#36493A" stroke="#485D4E" strokeWidth="1" />
              
              {/* No building in 2020: just open crop field */}
              <text x="330" y="260" fill="#889988" fontSize="12" fontFamily="monospace">Open Crop Field</text>

              {/* Waterway */}
              <path d="M 50,0 Q 200,200 450,280 T 800,450" fill="none" stroke="#253540" strokeWidth="28" />
            </svg>

            {/* Label in top left */}
            <div className="absolute top-4 left-4 bg-paper/90 dark:bg-night-surface/90 border border-hairline px-3 py-1 font-mono text-xs text-ink dark:text-paper font-bold">
              Baseline Survey: January 2020 (Sentinel-2)
            </div>
          </div>
        </div>

        {/* AI Encroachment Vector Bounding Polygon (Simulated) */}
        {showEncroachment && (
          <div
            className="absolute z-20 pointer-events-none border-2 border-dashed border-surveyRed bg-surveyRed/20 flex flex-col justify-between p-1.5"
            style={{
              left: "40%",
              top: "45%",
              width: "120px",
              height: "90px",
            }}
          >
            <div className="bg-surveyRed text-paper text-[9px] font-mono font-bold px-1 py-0.5 uppercase tracking-wider self-start">
              Encroachment Alert
            </div>
            <div className="text-[10px] font-mono text-paper font-bold drop-shadow">
              Confidence: 94.2%
            </div>
          </div>
        )}

        {/* Vertical Split Line Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-paper shadow-2xl z-30 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-paper text-ink border border-hairline flex items-center justify-center font-mono text-xs font-bold shadow-lg">
            ↔
          </div>
        </div>

        {/* Hidden Range Input on top of entire canvas */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(parseFloat(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
        />

        {/* Bottom Banner */}
        <div className="absolute bottom-3 left-3 z-30 bg-paper/90 dark:bg-night-surface/90 border border-hairline px-3 py-1 text-xs font-mono flex items-center gap-2">
          <span className="text-surveyRed font-bold">● AI Change Detector</span>
          <span className="text-ink-muted">| Drag left/right to compare baseline vs current</span>
        </div>
      </div>

      {/* Control Card */}
      <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-base text-ink dark:text-paper">
            Sub-Pixel Satellite Differencing (Simulated ML Inference)
          </h4>
          <p className="text-xs text-ink-muted font-mono mt-0.5">
            Model: ResNet-UNet ChangeNet v2.4 • Cadastral Mask: Khasra 144/1 & 144/2
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-mono text-ink dark:text-paper cursor-pointer">
            <input
              type="checkbox"
              checked={showEncroachment}
              onChange={(e) => setShowEncroachment(e.target.checked)}
              className="accent-surveyRed"
            />
            <span>Highlight Encroachment Polygon</span>
          </label>
        </div>
      </div>
    </div>
  );
};
