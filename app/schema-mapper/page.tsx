"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Layers,
  Code2,
  FileSpreadsheet,
} from "lucide-react";
import {
  STATE_SCHEMA_MAPPINGS,
  UNIT_CONVERSION_SAMPLES,
  SchemaFieldMapping,
  UnitConversionSample,
} from "@/data/stateSchemas";
import { useApp } from "@/components/providers/AppProvider";

export default function SchemaMapperPage() {
  const { lang } = useApp();

  const [activeState, setActiveState] = useState<"Rajasthan" | "Haryana" | "Maharashtra">("Rajasthan");
  const [selectedSample, setSelectedSample] = useState<UnitConversionSample>(UNIT_CONVERSION_SAMPLES[0]);
  const [customBigha, setCustomBigha] = useState(1);
  const [customBiswa, setCustomBiswa] = useState(4);

  // Live calculation of traditional units to normalized metric sq meters
  // In Jaipur Pucca Bigha: 1 Bigha = 2,529.28 m², 1 Biswa = 126.464 m²
  const customNormalizedSqM = Math.round(customBigha * 2529.28 + customBiswa * 126.464);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-hairline pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
            Interoperability Protocol (ISO 19152 LADM)
          </span>
          <span className="font-mono text-xs text-ink-muted">
            Federated Schema Harmonization
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
          {lang === "hi" ? "अंतर-राज्यीय स्कीमा मैपर" : "Inter-State Schema Mapper & Converter"}
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-1">
          Standardizes disparate state revenue schemas (Apna Khata vs Jamabandi vs MahaBhulekh) into the unified National Land Stack DPI format with metric normalization.
        </p>
      </div>

      {/* Field Mapping Table */}
      <div className="border border-hairline bg-paper dark:bg-night-surface space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3 font-mono text-xs">
          <div>
            <h3 className="font-serif text-xl font-bold text-ink dark:text-paper">
              Unified Land Stack Canonical Field Schema
            </h3>
            <div className="text-ink-muted text-[11px]">
              Direct field mapping between state dialects and central Land Stack
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-ink-muted">Comparing:</span>
            <span className="font-bold text-forest">Rajasthan (State A)</span>
            <span className="text-ink-muted">vs</span>
            <span className="font-bold text-ochre">Haryana / Maharashtra (State B)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-paper-light dark:bg-night-card border-b border-hairline uppercase tracking-wider text-[10px] text-ink-muted">
              <tr>
                <th className="p-3 w-1/4">Land Stack Standard Field</th>
                <th className="p-3 w-1/4">Rajasthan (Apna Khata / E-Dharti)</th>
                <th className="p-3 w-1/4">Haryana / Maharashtra Dialect</th>
                <th className="p-3 w-1/4">Normalization Engine Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {STATE_SCHEMA_MAPPINGS.map((m) => (
                <tr key={m.standardField} className="hover:bg-paper-light dark:hover:bg-night-card transition-colors">
                  <td className="p-3.5 align-top">
                    <div className="font-bold text-forest">{m.standardField}</div>
                    <div className="text-[10px] text-ink-muted">{m.standardType}</div>
                    <div className="text-[10px] text-ink-light mt-0.5">{m.standardDescription}</div>
                  </td>
                  <td className="p-3.5 align-top">
                    <div className="font-semibold text-ink dark:text-paper">{m.stateASourceField}</div>
                    <div className="text-[10px] text-ink-muted">{m.stateAUnit}</div>
                  </td>
                  <td className="p-3.5 align-top">
                    <div className="font-semibold text-ink dark:text-paper">{m.stateBSourceField}</div>
                    <div className="text-[10px] text-ink-muted">{m.stateBUnit}</div>
                  </td>
                  <td className="p-3.5 align-top text-ink-light dark:text-paper/80 text-[11px]">
                    {m.transformationRule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live "Convert a Sample Record" Interactive Demo */}
      <div className="p-6 bg-paper-light dark:bg-night-card border border-hairline space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold">
            Live Unit Normalization Demo
          </span>
          <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper mt-0.5">
            Convert Traditional Land Units into SI Metric Standard
          </h3>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Different regions define Bigha, Biswa, Kanal, Marla, and Guntha differently. Land Stack normalizes every cadastral parcel into SI metric square meters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Preset Converter Samples (6 cols) */}
          <div className="md:col-span-6 space-y-3 font-mono text-xs">
            <div className="text-ink-muted uppercase text-[10px] font-bold">
              Select Sample Regional Unit:
            </div>

            <div className="space-y-2">
              {UNIT_CONVERSION_SAMPLES.map((s) => {
                const isSelected = s.unitName === selectedSample.unitName;
                return (
                  <button
                    key={s.unitName}
                    onClick={() => setSelectedSample(s)}
                    className={`w-full p-3 border text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? "border-forest bg-paper dark:bg-night-surface font-bold text-forest shadow-xs"
                        : "border-hairline bg-paper dark:bg-night-surface text-ink dark:text-paper hover:border-forest/40"
                    }`}
                  >
                    <div>
                      <div>{s.unitName}</div>
                      <div className="text-[10px] text-ink-muted">{s.state} Record System</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-ink dark:text-paper">{s.sqMetersResult} m²</div>
                      <div className="text-[10px] text-ink-muted">{s.acresResult} Acres</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Bigha/Biswa Playground (6 cols) */}
          <div className="md:col-span-6 bg-paper dark:bg-night-surface border border-hairline p-5 space-y-4 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="border-b border-hairline pb-2 flex items-center justify-between">
                <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                  Custom Jaipur Bigha-Biswa Calculator
                </span>
                <span className="text-ink-muted text-[10px]">1 Bigha = 20 Biswa</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-ink-muted text-[10px] uppercase font-bold">Bigha (बीघा):</label>
                  <input
                    type="number"
                    min="0"
                    value={customBigha}
                    onChange={(e) => setCustomBigha(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 bg-paper-light dark:bg-night-card border border-hairline font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-ink-muted text-[10px] uppercase font-bold">Biswa (बिस्वा):</label>
                  <input
                    type="number"
                    min="0"
                    max="19"
                    value={customBiswa}
                    onChange={(e) => setCustomBiswa(Math.min(19, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full p-2 bg-paper-light dark:bg-night-card border border-hairline font-bold"
                  />
                </div>
              </div>

              {/* Conversion Output Sheet */}
              <div className="p-4 bg-forest-faint dark:bg-forest/15 border border-forest/30 space-y-2">
                <div className="text-[10px] uppercase font-bold text-forest">
                  Normalized Land Stack SI Values:
                </div>
                <div className="text-2xl font-serif font-bold text-forest dark:text-[#388062]">
                  {customNormalizedSqM.toLocaleString("en-IN")} Square Meters (m²)
                </div>
                <div className="grid grid-cols-2 gap-2 text-ink-muted text-[11px] pt-1 border-t border-forest/20">
                  <div>Square Yards: <strong className="text-ink dark:text-paper">{Math.round(customNormalizedSqM * 1.196).toLocaleString("en-IN")} sq yd</strong></div>
                  <div>Standard Acres: <strong className="text-ink dark:text-paper">{(customNormalizedSqM / 4046.86).toFixed(3)} acres</strong></div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-ink-muted">
              * Based on Standard Revenue Metric conversion prescribed under Section 24 of Rajasthan Land Revenue Act (1 Pucca Bigha = 165 x 165 ft = 2,529.28 m²).
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
