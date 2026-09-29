"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GitBranch,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { simulateSubdivision } from "@/lib/turfUtils";
import { Subdivision3D } from "@/components/3d/Subdivision3D";
import { useApp } from "@/components/providers/AppProvider";

function SubdivisionContent() {
  const searchParams = useSearchParams();
  const { lang } = useApp();
  const initialUlpin = searchParams.get("ulpin") || "RJ08040001001A";

  const [selectedUlpin, setSelectedUlpin] = useState(initialUlpin);
  const [splitRatio, setSplitRatio] = useState(0.5); // 50/50
  const [minPlotArea, setMinPlotArea] = useState(250); // sq meters (Rajasthan urban standard)
  const [view3D, setView3D] = useState(true);

  const parcel = useMemo(() => {
    return (
      PARCELS_DATA.find((p) => p.ulpin === selectedUlpin) || PARCELS_DATA[0]
    );
  }, [selectedUlpin]);

  // Turf.js simulation calculation
  const splitResult = useMemo(() => {
    return simulateSubdivision(parcel.coordinates, splitRatio, minPlotArea);
  }, [parcel, splitRatio, minPlotArea]);

  const bothCompliant =
    splitResult.parcelA.isCompliant && splitResult.parcelB.isCompliant;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-ochre text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Turf.js Geometric Severance Engine
            </span>
            <span className="font-mono text-xs text-ink-muted">
              Simulation Environment (Read-Only Preview)
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "भू-पार्सल विभाजन सिमुलेटर" : "Cadastral Subdivision Simulator"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Compute polygon severance geometries, check statutory minimum frontage and area requirements, and generate simulated sub-ULPINs.
          </p>
        </div>

        {/* Parcel Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ink-muted">Select Parcel:</span>
          <select
            value={selectedUlpin}
            onChange={(e) => setSelectedUlpin(e.target.value)}
            className="p-2 border border-hairline bg-paper-light dark:bg-night-card font-mono text-xs text-ink dark:text-paper focus:outline-none"
          >
            {PARCELS_DATA.slice(0, 15).map((p) => (
              <option key={p.ulpin} value={p.ulpin}>
                {p.ulpin} ({p.khasraNo} - {p.areaSqM} m²)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Panel: Sliders & Rules */}
      <div className="p-5 bg-paper-light dark:bg-night-card border border-hairline space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Split Ratio Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-ink dark:text-paper">
                Severance Ratio: {Math.round(splitRatio * 100)}% / {Math.round((1 - splitRatio) * 100)}%
              </span>
              <span className="text-ink-muted">Linear Longitude Cut</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.85"
              step="0.05"
              value={splitRatio}
              onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
              className="w-full accent-forest cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-muted">
              <span>15% Plot A</span>
              <span>50% Equal Split</span>
              <span>85% Plot A</span>
            </div>
          </div>

          {/* Minimum Statutory Plot Area Rule */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-ink dark:text-paper">
                Statutory Minimum Plot Size: {minPlotArea} m²
              </span>
              <span className="text-forest text-[11px] font-semibold">
                JDA Bylaws Rule
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="25"
              value={minPlotArea}
              onChange={(e) => setMinPlotArea(parseInt(e.target.value))}
              className="w-full accent-ochre cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-ink-muted">
              <span>50 m² (EWS Urban)</span>
              <span>250 m² (Standard)</span>
              <span>600 m² (Low Density)</span>
            </div>
          </div>

        </div>

        {/* Regulatory Compliance Result Banner */}
        <div className={`p-3 border font-mono text-xs flex items-center justify-between ${
          bothCompliant
            ? "border-forest/40 bg-forest-faint text-forest"
            : "border-surveyRed/40 bg-surveyRed-faint text-surveyRed"
        }`}>
          <div className="flex items-center gap-2">
            {bothCompliant ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-bold">
              {bothCompliant
                ? "Statutory Compliance: PASSED (Both sub-plots satisfy minimum planning bylaws)"
                : "Statutory Violation: Subdivided plot area falls below minimum threshold"}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold">
            Turf.js Calculation
          </span>
        </div>
      </div>

      {/* 2D & 3D Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Procedural Severance Block View */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-ink-muted">
            <span className="font-bold text-forest">3D Severance Model</span>
            <span>Orbit with cursor</span>
          </div>
          <Subdivision3D splitResult={splitResult} baseUlpin={parcel.ulpin} />
        </div>

        {/* Right Column: Resulting Sub-Parcel Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold">
            Simulated Resulting Child Parcels
          </div>

          {/* Sub-Plot A */}
          <div className={`p-4 border font-mono text-xs space-y-2 bg-paper dark:bg-night-card ${
            splitResult.parcelA.isCompliant ? "border-forest/40" : "border-surveyRed/40 bg-surveyRed-faint"
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest text-sm">
                Child Parcel A: {parcel.ulpin}/1
              </span>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                splitResult.parcelA.isCompliant ? "bg-forest text-paper" : "bg-surveyRed text-paper"
              }`}>
                {splitResult.parcelA.isCompliant ? "Approved" : "Sub-standard"}
              </span>
            </div>
            <div className="text-ink dark:text-paper">
              Calculated Area: <strong className="text-base">{splitResult.parcelA.areaSqM} m²</strong> ({Math.round(splitResult.parcelA.areaSqM * 1.196)} sq yd)
            </div>
            <div className="text-ink-muted text-[11px]">
              Assigned Provisional ULPIN: <span className="font-mono text-forest">{parcel.ulpin}A1</span>
            </div>
          </div>

          {/* Sub-Plot B */}
          <div className={`p-4 border font-mono text-xs space-y-2 bg-paper dark:bg-night-card ${
            splitResult.parcelB.isCompliant ? "border-forest/40" : "border-surveyRed/40 bg-surveyRed-faint"
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-ochre text-sm">
                Child Parcel B: {parcel.ulpin}/2
              </span>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                splitResult.parcelB.isCompliant ? "bg-forest text-paper" : "bg-surveyRed text-paper"
              }`}>
                {splitResult.parcelB.isCompliant ? "Approved" : "Sub-standard"}
              </span>
            </div>
            <div className="text-ink dark:text-paper">
              Calculated Area: <strong className="text-base">{splitResult.parcelB.areaSqM} m²</strong> ({Math.round(splitResult.parcelB.areaSqM * 1.196)} sq yd)
            </div>
            <div className="text-ink-muted text-[11px]">
              Assigned Provisional ULPIN: <span className="font-mono text-forest">{parcel.ulpin}A2</span>
            </div>
          </div>

          {/* Officer Action Note */}
          <div className="p-3 border border-hairline bg-paper-light dark:bg-night-surface text-[11px] font-mono text-ink-muted space-y-1">
            <span className="text-forest font-bold block">Next Statutory Step:</span>
            Upon formal Patwari field verification (Tattima Shajra), these two child records will automatically inherit parent deed history and receive distinct Bhu-Aadhaar numbers.
          </div>
        </div>

      </div>

    </div>
  );
}

export default function SubdivisionSimulatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-ink-muted">Loading subdivision simulator...</div>}>
      <SubdivisionContent />
    </Suspense>
  );
}
