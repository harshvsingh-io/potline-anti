"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Building,
  Landmark,
  Zap,
  Droplets,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { dbStore, DominoStep } from "@/lib/dbStore";
import { useApp } from "@/components/providers/AppProvider";

export default function DominoTrackerPage() {
  const { lang } = useApp();
  const [steps, setSteps] = useState<DominoStep[]>(dbStore.getDominoSteps());

  const handleAdvance = () => {
    const updated = dbStore.advanceDomino();
    setSteps([...updated]);
  };

  const handleReset = () => {
    const reset = dbStore.resetDomino();
    setSteps([...reset]);
  };

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const isFinished = completedCount === steps.length;

  const departmentIcons: Record<string, React.ReactNode> = {
    "Sub-Registrar Office": <Landmark className="w-5 h-5 text-forest" />,
    "Revenue Department (Patwari)": <FileCheck2 className="w-5 h-5 text-ochre" />,
    "Municipal Corporation": <Building className="w-5 h-5 text-slate" />,
    "Discom (JVVNL Electricity)": <Zap className="w-5 h-5 text-ochre" />,
    "Public Health (PHED Water)": <Droplets className="w-5 h-5 text-forest" />,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Automated Inter-Departmental Webhook Pipeline
            </span>
            <span className="font-mono text-xs text-ink-muted">
              ULPIN RJ08040001001A
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "डोमिनो विक्रय श्रृंखला ट्रैकर" : "Domino Transaction Tracker"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Simulates how a single registered conveyance cascades into automated Jamabandi mutation, municipal tax reassessment, and utility transfer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-hairline bg-paper dark:bg-night-surface hover:bg-paper-light font-mono text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleAdvance}
            disabled={isFinished}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs font-semibold uppercase tracking-wider border border-forest transition-colors shadow-sm disabled:opacity-50"
          >
            <Activity className="w-4 h-4" />
            <span>{isFinished ? "Chain Completed" : "Simulate Next Step"}</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Header */}
      <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline flex items-center justify-between font-mono text-xs">
        <div>
          <span className="text-ink-muted uppercase">Lifecycle Pipeline Status: </span>
          <strong className="text-forest">
            {completedCount} of {steps.length} Departments Synchronized
          </strong>
        </div>
        <div className="text-[11px] text-ink-muted">
          Avg Execution Latency: <strong className="text-ink dark:text-paper">&lt; 3.2s</strong>
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-forest/40 space-y-6">
        {steps.map((item, idx) => {
          const isDone = item.status === "completed";
          const isInProgress = item.status === "in_progress";

          return (
            <div key={item.step} className="relative space-y-2">
              {/* Stepper node circle */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold ${
                  isDone
                    ? "bg-forest border-forest text-paper"
                    : isInProgress
                    ? "bg-paper dark:bg-night border-ochre text-ochre animate-pulse"
                    : "bg-paper dark:bg-night border-ink/20 text-ink-muted"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
              </div>

              {/* Step Card */}
              <div
                className={`p-5 border transition-all ${
                  isDone
                    ? "border-forest/40 bg-paper-light dark:bg-night-card"
                    : isInProgress
                    ? "border-ochre bg-ochre-faint dark:bg-night-card"
                    : "border-hairline bg-paper dark:bg-night-surface opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-2.5">
                  <div className="flex items-center gap-2.5">
                    {departmentIcons[item.department] || <Building className="w-4 h-4 text-forest" />}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold block">
                        {item.department}
                      </span>
                      <h3 className="font-serif text-base font-bold text-ink dark:text-paper">
                        {lang === "hi" ? item.titleHi : item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="font-mono text-xs">
                    {isDone ? (
                      <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-bold uppercase">
                        Committed ({item.timestamp})
                      </span>
                    ) : isInProgress ? (
                      <span className="px-2 py-0.5 bg-ochre text-paper text-[10px] font-bold uppercase animate-pulse">
                        In Progress (Awaiting Webhook)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-ink/10 text-ink-muted text-[10px] uppercase">
                        Queued
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 space-y-1 font-mono text-xs text-ink-light dark:text-paper/80">
                  <p className="leading-relaxed">{item.details}</p>
                  <div className="text-[10px] text-ink-muted pt-1">
                    Authorized Officer / System Service: <strong className="text-ink dark:text-paper">{item.actor}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <div className="p-6 bg-paper-light dark:bg-night-card border border-hairline font-mono text-xs space-y-2">
        <div className="font-bold text-forest uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Why Domino Tracker Eliminates Citizen Bureaucracy:</span>
        </div>
        <p className="text-ink-light dark:text-paper/80 leading-relaxed font-sans text-xs">
          Historically in India, a citizen who purchases land must physically take certified copies of the registered sale deed 
          to the Tehsil office for Jamabandi mutation, to the Municipal Corporation for tax name change, and to the electricity / water board 
          with affidavits. Plotline&apos;s event-driven Land Stack dispatches cryptographic webhooks upon registry endorsement, 
          cascading identity updates across all five databases automatically.
        </p>
      </div>

    </div>
  );
}
