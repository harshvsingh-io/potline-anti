"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Send,
  Check,
  Building,
  Landmark,
  Eye,
  Filter,
} from "lucide-react";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { Neighborhood3D } from "@/components/3d/Neighborhood3D";
import { dbStore } from "@/lib/dbStore";
import { useApp } from "@/components/providers/AppProvider";

export default function ConflictRadarPage() {
  const { lang, role } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning">("all");
  const [resolvingUlpin, setResolvingUlpin] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [resolvedUlpins, setResolvedUlpins] = useState<string[]>([]);
  const [view3D, setView3D] = useState(true);

  // Extract all parcels that have inconsistencies
  const anomalyParcels = PARCELS_DATA.filter(
    (p) => p.inconsistencies.length > 0 && !resolvedUlpins.includes(p.ulpin)
  );

  const handleResolve = (ulpin: string) => {
    const note = actionNotes[ulpin] || "Administrative correction endorsed by officer.";
    dbStore.resolveConflict(ulpin, note);
    setResolvedUlpins((prev) => [...prev, ulpin]);
    setResolvingUlpin(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-surveyRed text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Cross-Layer Spatial & Ledger Diagnostics
            </span>
            <span className="font-mono text-xs text-ink-muted">
              Active Turf.js & PostGIS Geometric Rules
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "अंतर-विभागीय विवाद राडार" : "Cross-Department Conflict Radar"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Automatically surfaces title mismatches, boundary overlaps, unauthorized building permits, and undisclosed bank liens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView3D(!view3D)}
            className="px-3 py-2 border border-hairline bg-paper-light dark:bg-night-card font-mono text-xs uppercase tracking-wider text-ink dark:text-paper hover:border-forest"
          >
            {view3D ? "Hide 3D Neighborhood" : "Show 3D Neighborhood"}
          </button>
        </div>
      </div>

      {/* 3D Neighborhood Radar View with pulsing red anomaly blocks */}
      {view3D && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-ink-muted">
            <span className="flex items-center gap-1.5 text-surveyRed font-bold">
              <ShieldAlert className="w-4 h-4" />
              Neighborhood 3D Radar (Pulsing Blocks Indicate Conflicted Parcels)
            </span>
            <span>Use mouse to rotate and inspect cluster</span>
          </div>
          <Neighborhood3D initialHighlightAnomalies={true} />
        </div>
      )}

      {/* Triage Workspace: Ranked Anomaly List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-hairline">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper">
              Identified Inconsistencies ({anomalyParcels.length} Active)
            </h2>
            <div className="text-xs font-mono text-ink-muted">
              {resolvedUlpins.length > 0 && `${resolvedUlpins.length} anomalies remediated in this session`}
            </div>
          </div>

          {/* Severity Filter Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setFilterSeverity("all")}
              className={`px-2.5 py-1 border border-hairline ${
                filterSeverity === "all" ? "bg-forest text-paper font-bold" : "text-ink-muted hover:text-ink"
              }`}
            >
              All Severities
            </button>
            <button
              onClick={() => setFilterSeverity("critical")}
              className={`px-2.5 py-1 border border-hairline ${
                filterSeverity === "critical" ? "bg-surveyRed text-paper font-bold" : "text-ink-muted hover:text-ink"
              }`}
            >
              Critical Breaches
            </button>
          </div>
        </div>

        {anomalyParcels.length === 0 ? (
          <div className="p-12 text-center border border-hairline bg-paper-light dark:bg-night-card space-y-3 font-mono">
            <CheckCircle2 className="w-10 h-10 text-forest mx-auto" />
            <div className="font-serif text-xl font-bold text-ink dark:text-paper">
              All Cross-Layer Conflicts Resolved
            </div>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Every parcel in the Jaipur pilot matches cadastral geometries, sub-registrar deeds, municipal tax records, and master plan zoning.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalyParcels.map((parcel, idx) => (
              <div
                key={parcel.ulpin}
                className="p-5 border border-surveyRed/40 bg-paper-light dark:bg-night-card shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-paper bg-surveyRed px-2 py-0.5">
                      Priority #{idx + 1}
                    </span>
                    <Link
                      href={`/parcel/${parcel.ulpin}`}
                      className="font-mono font-bold text-base text-ink dark:text-paper hover:underline hover:text-forest"
                    >
                      {parcel.ulpin}
                    </Link>
                    <span className="font-mono text-xs text-ink-muted">
                      ({parcel.khasraNo} • {parcel.village})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-ink-muted">Dispute Risk Score:</span>
                    <span className="font-bold text-surveyRed text-sm">
                      {parcel.disputeRiskScore} / 100
                    </span>
                  </div>
                </div>

                {/* Anomaly Description & Diagnostics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono text-xs">
                  <div className="lg:col-span-8 space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-surveyRed font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Turf.js Diagnostic Finding:
                    </div>
                    <p className="text-ink dark:text-paper font-sans text-sm font-semibold leading-relaxed">
                      {parcel.inconsistencies[0]}
                    </p>
                    <div className="p-3 bg-paper dark:bg-night-surface border border-hairline space-y-1 text-ink-light dark:text-paper/80">
                      <div><span className="text-ink-muted">Recorded RoR Owner:</span> {parcel.owners[0]?.name}</div>
                      <div><span className="text-ink-muted">Registered Deed Buyer:</span> {parcel.latestDeed.buyerName} ({parcel.latestDeed.deedNo})</div>
                      <div><span className="text-ink-muted">Zoning Code:</span> {parcel.zoning.zoneType} ({parcel.zoning.masterPlanCode})</div>
                    </div>
                  </div>

                  {/* Remediation & Audit Log Action Column */}
                  <div className="lg:col-span-4 bg-paper dark:bg-night-surface border border-hairline p-3 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-forest font-bold">
                        Suggested DPI Action:
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        Issue automatic inter-departmental rectification notice and log entry to state immutable audit ledger.
                      </p>
                    </div>

                    {resolvingUlpin === parcel.ulpin ? (
                      <div className="space-y-2 pt-2 border-t border-hairline">
                        <textarea
                          placeholder="Enter administrative resolution remarks..."
                          value={actionNotes[parcel.ulpin] || ""}
                          onChange={(e) =>
                            setActionNotes({ ...actionNotes, [parcel.ulpin]: e.target.value })
                          }
                          className="w-full p-2 bg-paper-light dark:bg-night-card border border-hairline text-xs font-mono focus:outline-none"
                          rows={2}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolve(parcel.ulpin)}
                            className="flex-1 py-1.5 bg-forest hover:bg-forest-hover text-paper font-bold font-mono text-xs uppercase"
                          >
                            Commit Resolution
                          </button>
                          <button
                            onClick={() => setResolvingUlpin(null)}
                            className="px-2 py-1.5 border border-hairline text-ink-muted hover:text-ink font-mono text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2 border-t border-hairline">
                        <button
                          onClick={() => setResolvingUlpin(parcel.ulpin)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Resolve / Notify Dept</span>
                        </button>
                        <Link
                          href={`/parcel/${parcel.ulpin}`}
                          className="p-2 border border-hairline hover:border-forest text-ink-muted hover:text-forest"
                          title="Inspect parcel"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
