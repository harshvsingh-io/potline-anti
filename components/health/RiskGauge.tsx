"use client";

import React from "react";
import { RiskFactor } from "@/data/parcels";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface RiskGaugeProps {
  score: number; // 0 - 100
  factors: RiskFactor[];
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, factors }) => {
  const getRating = (val: number) => {
    if (val < 25) return { label: "LOW RISK (Clear Title)", color: "text-forest", bg: "bg-forest", border: "border-forest" };
    if (val < 65) return { label: "MODERATE RISK (Caution)", color: "text-ochre", bg: "bg-ochre", border: "border-ochre" };
    return { label: "HIGH RISK (Defective / Contested)", color: "text-surveyRed", bg: "bg-surveyRed", border: "border-surveyRed" };
  };

  const rating = getRating(score);

  return (
    <div className="p-5 bg-paper-light dark:bg-night-card border border-hairline">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
            Explainable Dispute Risk Metric
          </span>
          <h3 className="font-serif text-lg font-bold text-ink dark:text-paper">
            Composite Title Risk Score
          </h3>
        </div>
        <div className={`px-3 py-1 font-mono text-xs font-bold uppercase border ${rating.border} ${rating.color} bg-paper dark:bg-night`}>
          {rating.label}
        </div>
      </div>

      {/* Horizontal Gauge Bar */}
      <div className="space-y-1.5 my-4">
        <div className="flex justify-between text-xs font-mono">
          <span className="font-bold text-ink dark:text-paper text-sm">
            Score: {score} <span className="text-ink-muted font-normal text-xs">/ 100</span>
          </span>
          <span className="text-ink-muted text-[10px]">
            {score < 25 ? "Safe for registration" : score < 65 ? "Requires departmental clearance" : "Transaction prohibited"}
          </span>
        </div>
        <div className="h-3 w-full bg-paper-dark dark:bg-night-border rounded-none overflow-hidden relative border border-hairline">
          {/* Tick markers */}
          <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-ink/20 dark:bg-paper/20 z-10" />
          <div className="absolute top-0 bottom-0 left-[65%] w-[1px] bg-ink/20 dark:bg-paper/20 z-10" />
          
          <div
            className={`h-full transition-all duration-700 ${rating.bg}`}
            style={{ width: `${Math.min(100, Math.max(4, score))}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-ink-muted">
          <span>0 (Clean Title)</span>
          <span>25 (Advisory)</span>
          <span>65 (Warning)</span>
          <span>100 (Litigation / Defect)</span>
        </div>
      </div>

      {/* Explanatory Factors Breakdown */}
      <div className="mt-4 pt-3 border-t border-hairline">
        <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-2 font-bold">
          Weighted Risk Factor Breakdown ({factors.length}):
        </div>

        {factors.length === 0 ? (
          <div className="flex items-center gap-2 text-xs font-mono text-forest py-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>No negative risk factors identified across 5 department registries.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {factors.map((f, i) => (
              <div
                key={i}
                className="p-2.5 bg-paper dark:bg-night-surface border border-hairline text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {f.severity === "critical" ? (
                      <AlertCircle className="w-3.5 h-3.5 text-surveyRed shrink-0" />
                    ) : f.severity === "warning" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-ochre shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-slate shrink-0" />
                    )}
                    <span className="font-bold text-ink dark:text-paper">{f.factor}</span>
                  </div>
                  <span className="text-[10px] font-bold text-surveyRed">
                    +{f.score} pts
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink-light dark:text-paper/80 leading-relaxed pl-5">
                  {f.explanation}
                </p>
                <div className="mt-1 pl-5 text-[9px] text-ink-muted uppercase">
                  Source: {f.department}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
