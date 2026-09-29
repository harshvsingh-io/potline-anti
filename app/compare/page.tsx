"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GitCompare,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { useApp } from "@/components/providers/AppProvider";

function CompareContent() {
  const searchParams = useSearchParams();
  const { lang } = useApp();
  const p1Param = searchParams.get("p1") || "RJ08040001001A";
  const p2Param = searchParams.get("p2") || "RJ08040001002A";

  const [selectedUlpins, setSelectedUlpins] = useState<string[]>([
    p1Param,
    p2Param,
  ]);

  const addParcel = (ulpin: string) => {
    if (selectedUlpins.length < 3 && !selectedUlpins.includes(ulpin)) {
      setSelectedUlpins([...selectedUlpins, ulpin]);
    }
  };

  const removeParcel = (ulpin: string) => {
    if (selectedUlpins.length > 2) {
      setSelectedUlpins(selectedUlpins.filter((u) => u !== ulpin));
    }
  };

  const comparedParcels: ParcelData[] = selectedUlpins
    .map((u) => PARCELS_DATA.find((p) => p.ulpin === u))
    .filter((p): p is ParcelData => Boolean(p));

  // Helper to determine if an attribute differs across parcels
  const hasDiff = (keyFn: (p: ParcelData) => string | number | boolean) => {
    if (comparedParcels.length < 2) return false;
    const firstVal = keyFn(comparedParcels[0]);
    return comparedParcels.some((p) => keyFn(p) !== firstVal);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Cross-Parcel Comparative Intelligence
            </span>
            <span className="font-mono text-xs text-ink-muted">
              Compare 2 or 3 Cadastral Parcels
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "भू-पार्सल तुलना पटल" : "Compare Land Parcels"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Side-by-side title provenance, encumbrance liabilities, planning zoning, and dispute risk metrics with difference highlighting.
          </p>
        </div>

        {/* Add 3rd Parcel Selector */}
        {selectedUlpins.length < 3 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-muted">Add 3rd Parcel:</span>
            <select
              onChange={(e) => {
                if (e.target.value) addParcel(e.target.value);
              }}
              defaultValue=""
              className="p-2 border border-hairline bg-paper-light dark:bg-night-card font-mono text-xs text-ink dark:text-paper focus:outline-none"
            >
              <option value="" disabled>Choose parcel...</option>
              {PARCELS_DATA.filter((p) => !selectedUlpins.includes(p.ulpin)).slice(0, 10).map((p) => (
                <option key={p.ulpin} value={p.ulpin}>
                  {p.ulpin} ({p.khasraNo})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid Table */}
      <div className="border border-hairline bg-paper dark:bg-night-surface overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-paper-light dark:bg-night-card border-b border-hairline">
              <th className="p-4 w-1/4 text-ink-muted uppercase tracking-wider text-[11px]">
                Cadastral Attribute
              </th>
              {comparedParcels.map((parcel) => (
                <th key={parcel.ulpin} className="p-4 border-l border-hairline">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/parcel/${parcel.ulpin}`}
                        className="font-serif text-base font-bold text-ink dark:text-paper hover:underline hover:text-forest"
                      >
                        {parcel.ulpin}
                      </Link>
                      <div className="text-[10px] text-ink-muted font-normal mt-0.5">
                        {parcel.khasraNo} • {parcel.village}
                      </div>
                    </div>
                    {selectedUlpins.length > 2 && (
                      <button
                        onClick={() => removeParcel(parcel.ulpin)}
                        className="p-1 text-ink-muted hover:text-surveyRed"
                        title="Remove parcel from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline">
            
            {/* Risk Score */}
            <tr className={hasDiff((p) => p.disputeRiskScore) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Dispute Risk Score</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                  <span className={`px-2 py-0.5 font-bold ${
                    p.disputeRiskScore > 60 ? "bg-surveyRed text-paper" : p.disputeRiskScore > 30 ? "bg-ochre text-paper" : "bg-forest text-paper"
                  }`}>
                    {p.disputeRiskScore} / 100
                  </span>
                </td>
              ))}
            </tr>

            {/* Land Use & Zoning */}
            <tr className={hasDiff((p) => p.landUse) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Land Use Classification</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline font-semibold">
                  {p.landUse} ({p.zoning.zoneType})
                </td>
              ))}
            </tr>

            {/* Digitized Area */}
            <tr className={hasDiff((p) => p.areaSqM) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Cadastral Area (Metric)</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                  <strong className="text-sm">{p.areaSqM} m²</strong>
                  <div className="text-[10px] text-ink-muted">{p.areaOriginal}</div>
                </td>
              ))}
            </tr>

            {/* Recorded Khatedar Owner */}
            <tr className={hasDiff((p) => p.owners[0]?.name) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Primary Legal Owner</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                  <div className="font-bold text-ink dark:text-paper">{p.owners[0]?.name}</div>
                  <div className="text-[10px] text-ink-muted">s/o {p.owners[0]?.fatherName}</div>
                </td>
              ))}
            </tr>

            {/* Sub-Registrar Latest Deed */}
            <tr className={hasDiff((p) => p.latestDeed.deedNo) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Latest Registered Deed</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline space-y-0.5">
                  <div>{p.latestDeed.deedNo}</div>
                  <div className="text-[10px] text-ink-muted">Buyer: {p.latestDeed.buyerName}</div>
                  <div className="text-[10px] text-ink-muted">Value: ₹{p.latestDeed.declaredValue.toLocaleString("en-IN")}</div>
                </td>
              ))}
            </tr>

            {/* Encumbrance & Mortgages */}
            <tr className={hasDiff((p) => p.encumbrances.length) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Bank Encumbrance / Lien</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                  {p.encumbrances.length === 0 ? (
                    <span className="text-forest font-bold">✓ Nil Encumbrance</span>
                  ) : (
                    <span className="text-surveyRed font-bold">
                      ⚠ {p.encumbrances[0]?.bankName} (₹{p.encumbrances[0]?.loanAmount.toLocaleString("en-IN")})
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Property Tax Status */}
            <tr className={hasDiff((p) => p.tax.paymentStatus) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Municipal Tax Status</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                  <span className={`font-bold ${p.tax.totalDue > 0 ? "text-surveyRed" : "text-forest"}`}>
                    {p.tax.paymentStatus} {p.tax.totalDue > 0 ? `(₹${p.tax.totalDue.toLocaleString("en-IN")})` : ""}
                  </span>
                </td>
              ))}
            </tr>

            {/* Circle Rate / DLC Rate */}
            <tr className={hasDiff((p) => p.circleRatePerSqM) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Guidance DLC Rate</td>
              {comparedParcels.map((p) => (
                <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                  ₹{p.circleRatePerSqM.toLocaleString("en-IN")} / m²
                </td>
              ))}
            </tr>

            {/* 8-Point Compliance Passes */}
            <tr className={hasDiff((p) => p.healthChecks.filter((c) => c.status === "pass").length) ? "bg-ochre-faint/30 dark:bg-ochre/10" : ""}>
              <td className="p-3.5 font-bold text-ink dark:text-paper">Health Report Matrix</td>
              {comparedParcels.map((p) => {
                const passCount = p.healthChecks.filter((c) => c.status === "pass").length;
                return (
                  <td key={p.ulpin} className="p-3.5 border-l border-hairline">
                    <span className="font-bold text-forest">{passCount} of 8 Checks Passed</span>
                    <div className="mt-1">
                      <Link href={`/health/${p.ulpin}`} className="text-forest hover:underline text-[10px]">
                        View Full Health Audit →
                      </Link>
                    </div>
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>

      <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline font-mono text-xs flex items-center justify-between">
        <span className="text-ink-muted">
          Highlighted rows indicate differing values between compared parcels.
        </span>
        <span className="text-forest font-bold">Datum: ISO 19152 LADM Schema</span>
      </div>

    </div>
  );
}

export default function CompareParcelsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-ink-muted">Loading comparison matrix...</div>}>
      <CompareContent />
    </Suspense>
  );
}
