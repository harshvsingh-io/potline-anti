"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Satellite, ShieldAlert, Sparkles, MapPin, ArrowRight, Eye, AlertCircle } from "lucide-react";
import { SatelliteSlider } from "@/components/map/SatelliteSlider";
import { PARCELS_DATA } from "@/data/parcels";
import { useApp } from "@/components/providers/AppProvider";

export default function ChangeDetectionPage() {
  const { lang } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-hairline pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-surveyRed text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
            Earth Observation & Cadastral Vector AI
          </span>
          <span className="font-mono text-xs text-ink-muted">
            Simulated Sentinel-2 & Drone Change Detection
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
          {lang === "hi" ? "भू-परिवर्तन एवं अतिक्रमण पहचान" : "Satellite Temporal Change & Encroachment Detection"}
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-1">
          Detects unauthorized structures, watercourse buffer violations, and cadastral boundary fence shifts between baseline surveys and drone flights.
        </p>
      </div>

      {/* Main Interactive Slider Component */}
      <SatelliteSlider />

      {/* Analytics & Flagged Inconsistencies Table */}
      <div className="border border-hairline bg-paper dark:bg-night-surface p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-hairline pb-2">
          <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
            AI Computer Vision Detections (Pilot Ward 14 & Sanganer)
          </span>
          <span className="text-ink-muted text-[10px]">Confidence &gt; 90%</span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-paper-light dark:bg-night-card border border-surveyRed/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-surveyRed">
                Detected: Unauthorized G+2 Concrete Warehouse Structure
              </span>
              <span className="px-2 py-0.5 bg-surveyRed text-paper font-bold text-[10px]">
                94.2% AI Confidence
              </span>
            </div>
            <p className="text-ink-light dark:text-paper/80 leading-relaxed font-sans text-xs">
              Cadastral mask for Khasra 144/1 intersects with new 90 m² building footprint constructed between Jan 2020 and Sep 2024. 
              No CLU (Change of Land Use) or Section 90-A permission recorded in Revenue Jamabandi.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-hairline text-ink-muted text-[11px]">
              <span>Target: Khasra 144/1 (ULPIN RJ08040001004A)</span>
              <Link href="/parcel/RJ08040001004A" className="text-forest hover:underline font-bold">
                Inspect Parcel 360° Record →
              </Link>
            </div>
          </div>

          <div className="p-3.5 bg-paper-light dark:bg-night-card border border-ochre/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-ochre">
                Detected: Dravyavati River Flood Setback Encroachment
              </span>
              <span className="px-2 py-0.5 bg-ochre text-paper font-bold text-[10px]">
                91.8% AI Confidence
              </span>
            </div>
            <p className="text-ink-light dark:text-paper/80 leading-relaxed font-sans text-xs">
              Boundary wall erected 14 meters inside the statutory 30m eco-sensitive riparian buffer corridor. 
              NGT compliance flag automatically issued to Jaipur Development Authority enforcement wing.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-hairline text-ink-muted text-[11px]">
              <span>Target: Khasra 145/1 (ULPIN RJ08040001006A)</span>
              <Link href="/parcel/RJ08040001006A" className="text-forest hover:underline font-bold">
                Inspect Parcel 360° Record →
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
