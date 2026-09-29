"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  MapPin,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building,
  BarChart3,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { RAJASTHAN_DISTRICT_STATS, StateDistrictStat } from "@/data/rajasthanDistricts";
import { useApp } from "@/components/providers/AppProvider";

const CADASTRAL_TRENDS = [
  { year: "2021", coverage: 42, avgDays: 140 },
  { year: "2022", coverage: 65, avgDays: 95 },
  { year: "2023", coverage: 82, avgDays: 45 },
  { year: "2024", coverage: 94, avgDays: 18 },
  { year: "2025 (Proj)", coverage: 99, avgDays: 7 },
];

export default function LandPulsePage() {
  const { lang } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<StateDistrictStat>(
    RAJASTHAN_DISTRICT_STATS[0] // Jaipur
  );

  const totalStateParcels = RAJASTHAN_DISTRICT_STATS.reduce((acc, d) => acc + d.totalParcels, 0);
  const totalUlpinsAssigned = RAJASTHAN_DISTRICT_STATS.reduce((acc, d) => acc + d.ulpinAssigned, 0);
  const avgStateCoverage = Math.round((totalUlpinsAssigned / totalStateParcels) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              State Land Records Directorate (DLRS HQ)
            </span>
            <span className="font-mono text-xs text-ink-muted">
              State of Rajasthan Macro Analytics
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "लैंड पल्स (राज्य-स्तरीय डैशबोर्ड)" : "Land Pulse: State DPI Overview"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            District-wise Bhu-Aadhaar ULPIN coverage, automated mutation velocity, and spatial conflict density index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/schema-mapper"
            className="px-3.5 py-2 border border-hairline bg-paper-light dark:bg-night-card font-mono text-xs text-ink dark:text-paper hover:border-forest"
          >
            Schema Mapper →
          </Link>
        </div>
      </div>

      {/* State-Level Macro Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-[10px] uppercase text-ink-muted">Statewide ULPIN Coverage</div>
          <div className="text-3xl font-serif font-bold text-forest mt-1">
            {avgStateCoverage}%
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5">3.4M of 3.8M Registered</div>
        </div>

        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-[10px] uppercase text-ink-muted">Total Indexed Cadastres</div>
          <div className="text-3xl font-serif font-bold text-ink dark:text-paper mt-1">
            {(totalStateParcels / 100000).toFixed(1)} Lakh
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5">8 Key Pilot Districts</div>
        </div>

        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-[10px] uppercase text-ink-muted">Pending Mutation Backlog</div>
          <div className="text-3xl font-serif font-bold text-ochre mt-1">
            5,920
          </div>
          <div className="text-[10px] text-forest font-bold mt-0.5">-74% vs Pre-DPI</div>
        </div>

        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-[10px] uppercase text-ink-muted">State Avg Mutation Time</div>
          <div className="text-3xl font-serif font-bold text-forest mt-1">
            16.2 Days
          </div>
          <div className="text-[10px] text-forest font-bold mt-0.5">Down from 180 Days</div>
        </div>
      </div>

      {/* District Choropleth Grid + Selected District Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* District Tiles Choropleth Map View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline font-mono text-xs">
            <span className="font-bold text-forest uppercase tracking-wider">
              District ULPIN Saturation Choropleth
            </span>
            <span className="text-ink-muted">Click district to inspect details</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            {RAJASTHAN_DISTRICT_STATS.map((d) => {
              const isSelected = d.district === selectedDistrict.district;
              return (
                <button
                  key={d.district}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-3.5 border text-left transition-all relative ${
                    isSelected
                      ? "border-forest bg-forest-faint dark:bg-forest/20 shadow-sm"
                      : "border-hairline bg-paper dark:bg-night-surface hover:border-forest/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-ink dark:text-paper">
                      {d.district}
                    </span>
                    <span className="text-[9px] font-hindi text-ink-muted">
                      {d.districtHi}
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-serif font-bold text-forest">
                    {d.coveragePct}%
                  </div>
                  <div className="text-[10px] text-ink-muted">
                    Backlog: {d.pendingMutations} cases
                  </div>
                  {d.disputeHotspotSeverity === "high" && (
                    <div className="mt-1.5 text-[9px] font-bold text-surveyRed uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-surveyRed" />
                      Hotspot
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Statewide Longitudinal Trends Chart */}
          <div className="p-5 bg-paper-light dark:bg-night-card border border-hairline space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-forest uppercase tracking-wider">
                Multi-Year DPI Adoption Velocity
              </span>
              <span className="text-ink-muted">Coverage % vs Avg Resolution Days</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CADASTRAL_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,38,33,0.1)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis tick={{ fontSize: 11, fontFamily: "monospace" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F4EFE6",
                      border: "1px solid rgba(27,38,33,0.2)",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="coverage" name="Cadastral Coverage %" stroke="#1F4D3A" fill="#1F4D3A" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Selected District Deep-Dive Panel (5 cols) */}
        <div className="lg:col-span-5 bg-paper-light dark:bg-night-card border border-hairline p-6 space-y-5 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-hairline pb-3">
              <div className="text-[10px] text-forest uppercase tracking-wider font-bold">
                District Profile Inspection
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper">
                {selectedDistrict.district} ({selectedDistrict.districtHi})
              </h3>
              <div className="text-ink-muted text-[11px] mt-0.5">
                Headquarters: Lat {selectedDistrict.coordinates[0]}°N, Lng {selectedDistrict.coordinates[1]}°E
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-paper dark:bg-night-surface border border-hairline flex items-center justify-between">
                <span className="text-ink-muted">Total Surveyed Parcels:</span>
                <span className="font-bold text-sm">{selectedDistrict.totalParcels.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-3 bg-paper dark:bg-night-surface border border-hairline flex items-center justify-between">
                <span className="text-ink-muted">ULPINs Issued & Geotagged:</span>
                <span className="font-bold text-sm text-forest">{selectedDistrict.ulpinAssigned.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-3 bg-paper dark:bg-night-surface border border-hairline flex items-center justify-between">
                <span className="text-ink-muted">Current Mutation Queue:</span>
                <span className="font-bold text-sm text-ochre">{selectedDistrict.pendingMutations}</span>
              </div>
              <div className="p-3 bg-paper dark:bg-night-surface border border-hairline flex items-center justify-between">
                <span className="text-ink-muted">Cross-Layer Conflicts Logged:</span>
                <span className="font-bold text-sm text-surveyRed">{selectedDistrict.conflictsDetected} ({selectedDistrict.conflictsResolved} Resolved)</span>
              </div>
              <div className="p-3 bg-paper dark:bg-night-surface border border-hairline flex items-center justify-between">
                <span className="text-ink-muted">Average Mutation Turnaround:</span>
                <span className="font-bold text-sm">{selectedDistrict.avgResolutionDays} Days</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-paper dark:bg-night-surface border border-hairline space-y-2">
            <span className="text-[10px] font-bold text-forest uppercase tracking-wider block">
              DPI Policy Recommendation:
            </span>
            <p className="text-[11px] text-ink-light dark:text-paper/80 leading-relaxed font-sans">
              Deploy drone resurvey flights in the high-growth urban periphery to eliminate remaining 
              cadastral collision overlaps and synchronize Gram Panchayat building sanctions with JDA Master Plan 2025.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
