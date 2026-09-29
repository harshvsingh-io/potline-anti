"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { RiskGauge } from "@/components/health/RiskGauge";
import { HealthPdfButton } from "@/components/health/HealthPdfButton";
import { VerifiedStamp } from "@/components/branding/VerifiedStamp";
import { useApp } from "@/components/providers/AppProvider";

export default function HealthReportPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useApp();
  const ulpinParam = (params?.ulpin as string) || "RJ08040001001A";

  const [parcel, setParcel] = useState<ParcelData | null>(null);

  useEffect(() => {
    const found = PARCELS_DATA.find(
      (p) => p.ulpin.toUpperCase() === ulpinParam.toUpperCase()
    ) || PARCELS_DATA[0];
    setParcel(found);
    if (found) {
      document.title = `Health Report ${found.ulpin} | Plotline`;
    }
  }, [ulpinParam]);

  if (!parcel) return null;

  const passedCount = parcel.healthChecks.filter((c) => c.status === "pass").length;
  const warnedCount = parcel.healthChecks.filter((c) => c.status === "warn").length;
  const failedCount = parcel.healthChecks.filter((c) => c.status === "fail").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <Link
            href={`/parcel/${parcel.ulpin}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-forest mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Parcel {parcel.ulpin}</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-ink dark:text-paper">
              {lang === "hi" ? "भू-पार्सल स्वास्थ्य एवं जोखिम रिपोर्ट" : "Parcel Title Health & Risk Report"}
            </h1>
          </div>
          <p className="font-mono text-xs text-ink-muted mt-1">
            ULPIN: <strong className="text-ink dark:text-paper">{parcel.ulpin}</strong> • Khasra: {parcel.khasraNo} • {parcel.village}, {parcel.district}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <HealthPdfButton parcel={parcel} />
          <Link
            href={`/verify/${parcel.ulpin}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-paper dark:bg-night-surface hover:bg-paper-light border border-hairline font-mono text-xs text-ink dark:text-paper transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-forest" />
            <span>Public Verify URL</span>
          </Link>
        </div>
      </div>

      {/* Summary Scorecard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-center">
        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-xs uppercase text-ink-muted">Health Inspection</div>
          <div className="text-2xl font-serif font-bold text-ink dark:text-paper mt-1">
            {passedCount} / 8 Passed
          </div>
          <div className="text-[10px] text-forest font-bold mt-0.5">Automated Rules</div>
        </div>

        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-xs uppercase text-ink-muted">Warning Flags</div>
          <div className="text-2xl font-serif font-bold text-ochre mt-1">
            {warnedCount} Items
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5">Advisory Review</div>
        </div>

        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-xs uppercase text-ink-muted">Critical Breaches</div>
          <div className="text-2xl font-serif font-bold text-surveyRed mt-1">
            {failedCount} Items
          </div>
          <div className="text-[10px] text-surveyRed font-bold mt-0.5">Immediate Block</div>
        </div>

        <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline">
          <div className="text-xs uppercase text-ink-muted">Dispute Risk Score</div>
          <div className="text-2xl font-serif font-bold text-ink dark:text-paper mt-1">
            {parcel.disputeRiskScore} <span className="text-xs font-normal text-ink-muted">/100</span>
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5">Weighted Model</div>
        </div>
      </div>

      {/* Composite Risk Gauge */}
      <RiskGauge
        score={parcel.disputeRiskScore}
        factors={parcel.disputeRiskFactors || parcel.riskFactors || []}
      />

      {/* 8-Point Automated Health Inspection Table */}
      <div className="border border-hairline bg-paper dark:bg-night-surface space-y-4 p-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold">
            Multi-Departmental Verification Matrix
          </span>
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper mt-0.5">
            8-Point Automated Title Integrity Checks
          </h2>
          <p className="font-mono text-xs text-ink-muted mt-1 leading-relaxed">
            Every parcel is evaluated by cross-referencing Revenue RoR, Registration deeds, CERSAI banking liens, 
            Master Plan zoning, Municipal tax balances, Cadastral GIS vectors, and Disaster flood boundaries.
          </p>
        </div>

        <div className="divide-y divide-hairline border-t border-hairline font-mono text-xs">
          {parcel.healthChecks.map((check, idx) => {
            const isPass = check.status === "pass";
            const isWarn = check.status === "warn";
            return (
              <div
                key={check.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-paper-light dark:hover:bg-night-card px-2 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isPass ? (
                      <CheckCircle2 className="w-5 h-5 text-forest" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-5 h-5 text-ochre" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-surveyRed" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="font-serif font-bold text-sm text-ink dark:text-paper">
                      {idx + 1}. {lang === "hi" ? check.titleHi : check.title}
                    </div>
                    <p className="text-ink-light dark:text-paper/80 font-sans text-xs leading-relaxed">
                      {lang === "hi" ? check.detailHi : check.detail}
                    </p>
                    <div className="text-[10px] text-ink-muted">
                      Source Authority: <strong className="text-ink dark:text-paper">{check.department}</strong>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      isPass
                        ? "bg-forest-faint text-forest border border-forest/30"
                        : isWarn
                        ? "bg-ochre-faint text-ochre border border-ochre/30"
                        : "bg-surveyRed-faint text-surveyRed border border-surveyRed/30"
                    }`}
                  >
                    {isPass ? "Compliant" : isWarn ? "Review Needed" : "Non-Compliant"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certification Footer */}
      <div className="p-6 bg-paper-light dark:bg-night-card border border-hairline flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink dark:text-paper">
            Tamper-Proof Digital Verification
          </h4>
          <p className="font-mono text-xs text-ink-muted mt-1 max-w-md">
            This health report is cryptographically bound to ULPIN {parcel.ulpin} and can be verified by any citizen, bank officer, or buyer on the public portal.
          </p>
        </div>

        <VerifiedStamp size="md" lang={lang} dateText="2026-09-29" animate={false} />
      </div>

    </div>
  );
}
