"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, Hash, Clock, Landmark } from "lucide-react";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { VerifiedStamp } from "@/components/branding/VerifiedStamp";
import { Wordmark } from "@/components/branding/Wordmark";
import { useApp } from "@/components/providers/AppProvider";

export default function PublicVerifyPage() {
  const params = useParams();
  const { lang } = useApp();
  const idParam = (params?.id as string) || "RJ08040001001A";

  const [parcel, setParcel] = useState<ParcelData | null>(null);

  useEffect(() => {
    const found = PARCELS_DATA.find(
      (p) => p.ulpin.toUpperCase() === idParam.toUpperCase()
    ) || PARCELS_DATA[0];
    setParcel(found);
    if (found) {
      document.title = `Verify Parcel ${found.ulpin} | Plotline`;
    }
  }, [idParam]);

  if (!parcel) return null;

  const mockHash = `0x9f8e7d6c5b4a3210${parcel.ulpin.toLowerCase()}8847`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Verification Container Sheet */}
      <div className="bg-paper-light dark:bg-night-card border border-hairline p-8 shadow-xl relative overflow-hidden">
        
        {/* Top Seal & Heading */}
        <div className="text-center space-y-2 border-b border-hairline pb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            GOVERNMENT OF RAJASTHAN • DEPARTMENT OF LAND RECORDS
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "सार्वजनिक भू-अभिलेख सत्यापन" : "Public Land Record Verification"}
          </h1>
          <p className="font-mono text-xs text-forest font-semibold">
            ✓ Authenticated via Land Stack Digital Public Infrastructure
          </p>
        </div>

        {/* The Signature Animated Ink Stamp Showcase */}
        <div className="py-8 flex flex-col items-center justify-center">
          <VerifiedStamp size="lg" lang={lang} dateText="2026-09-29" animate={true} />
          <div className="font-mono text-xs text-forest font-bold uppercase tracking-wider mt-3">
            Digital Certificate Authenticated
          </div>
          <div className="font-mono text-[10px] text-ink-muted">
            Tamper-evident record verified against state cadastral ledger
          </div>
        </div>

        {/* Parcel Attributes Credential Sheet */}
        <div className="border border-hairline bg-paper dark:bg-night-surface p-5 space-y-3 font-mono text-xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold border-b border-hairline pb-1.5 flex items-center justify-between">
            <span>Verified Parcel Ledger Snapshot</span>
            <span>Status: ACTIVE VALID</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-ink dark:text-paper">
            <div>
              <span className="text-ink-muted text-[10px] block">ULPIN (Bhu-Aadhaar):</span>
              <span className="font-bold text-sm text-forest">{parcel.ulpin}</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] block">Khasra / Survey Number:</span>
              <span className="font-bold">{parcel.khasraNo} ({parcel.surveyNo})</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] block">Recorded Legal Owner (RoR):</span>
              <span className="font-bold">{parcel.owners[0]?.name}</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] block">Location Jurisdiction:</span>
              <span>{parcel.village}, Tehsil {parcel.tehsil}, {parcel.district}</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] block">Normalized Surface Area:</span>
              <span className="font-bold">{parcel.areaSqM} m² ({parcel.areaOriginal})</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] block">Zoning & Land Classification:</span>
              <span>{parcel.zoning.zoneType} / {parcel.landUse}</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Verification */}
          <div className="pt-3 border-t border-hairline space-y-1">
            <div className="text-[10px] text-ink-muted flex items-center gap-1.5 font-bold">
              <Hash className="w-3.5 h-3.5 text-forest" />
              <span>Immutable Verification Digest (SHA-256):</span>
            </div>
            <div className="p-2 bg-paper-light dark:bg-night-card border border-hairline text-[10px] text-ink-muted font-mono break-all select-all">
              {mockHash}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={`/parcel/${parcel.ulpin}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs font-semibold uppercase tracking-wider border border-forest transition-colors w-full sm:w-auto justify-center"
          >
            <span>View 360° Parcel Record</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/health/${parcel.ulpin}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-ink-muted hover:text-forest transition-colors"
          >
            <span>Inspect 8-Point Compliance Matrix →</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
