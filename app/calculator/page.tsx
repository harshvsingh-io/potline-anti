"use client";

import React, { useState, useMemo } from "react";
import { Calculator, Landmark, ShieldCheck, Info, ArrowRight, Download } from "lucide-react";
import { PARCELS_DATA } from "@/data/parcels";
import { useApp } from "@/components/providers/AppProvider";

export default function CalculatorPage() {
  const { lang } = useApp();

  const [selectedUlpin, setSelectedUlpin] = useState<string>("RJ08040001001A");
  const [areaSqM, setAreaSqM] = useState<number>(2529);
  const [landType, setLandType] = useState<"Agricultural" | "Residential" | "Commercial">("Agricultural");
  const [dlcRate, setDlcRate] = useState<number>(4200);
  const [roadWidthMeters, setRoadWidthMeters] = useState<number>(9);
  const [buyerCategory, setBuyerCategory] = useState<"general" | "female" | "senior" | "joint">("general");
  const [declaredValue, setDeclaredValue] = useState<number>(10621800);

  // Auto-populate when selecting a parcel
  const handleParcelSelect = (ulpin: string) => {
    setSelectedUlpin(ulpin);
    const p = PARCELS_DATA.find((x) => x.ulpin === ulpin);
    if (p) {
      setAreaSqM(p.areaSqM);
      setLandType(p.landUse === "Commercial" ? "Commercial" : p.landUse === "Residential" ? "Residential" : "Agricultural");
      setDlcRate(p.circleRatePerSqM);
      setRoadWidthMeters(p.roadWidthMeters);
      setDeclaredValue(p.latestDeed.declaredValue);
    }
  };

  // Statutory Valuation Calculation (Rajasthan Stamps Act)
  const calculation = useMemo(() => {
    // Road frontage multiplier: if road > 18m, 10% premium; if > 24m, 20% premium
    let roadMultiplier = 1.0;
    if (roadWidthMeters >= 24) roadMultiplier = 1.2;
    else if (roadWidthMeters >= 18) roadMultiplier = 1.1;

    const baseValuation = areaSqM * dlcRate;
    const assessedDlcValue = Math.round(baseValuation * roadMultiplier);
    
    // Higher of assessed circle rate or declared sale value
    const finalTaxableValue = Math.max(assessedDlcValue, declaredValue);

    // Stamp duty rates in Rajasthan:
    // General Male: 6%
    // Female / Women Buyer: 5% (1% statutory concession)
    // Senior Citizen: 5.5%
    // Joint (Male + Female): 5.5%
    let stampRate = 0.06;
    if (buyerCategory === "female") stampRate = 0.05;
    else if (buyerCategory === "senior" || buyerCategory === "joint") stampRate = 0.055;

    const baseStampDuty = Math.round(finalTaxableValue * stampRate);

    // Surcharges (Rajasthan Cow Protection & Infrastructure Cess: 10% of stamp duty)
    const surchargeCess = Math.round(baseStampDuty * 0.10);

    // Registration Fee: 1% of taxable value (Max cap ₹50,000 for residential / ₹1,00,000 commercial in standard slabs)
    const registrationFee = Math.round(finalTaxableValue * 0.01);

    const totalGovtReceipt = baseStampDuty + surchargeCess + registrationFee;

    return {
      roadMultiplier,
      assessedDlcValue,
      finalTaxableValue,
      stampRatePct: stampRate * 100,
      baseStampDuty,
      surchargeCess,
      registrationFee,
      totalGovtReceipt,
    };
  }, [areaSqM, dlcRate, roadWidthMeters, buyerCategory, declaredValue]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-hairline pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
            Rajasthan Stamps & Registration Act, 1998
          </span>
          <span className="font-mono text-xs text-ink-muted">
            Automated DLC Circle Rate Valuation
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
          {lang === "hi" ? "स्टाम्प शुल्क एवं मूल्यांकन कैलकुलेटर" : "Stamp Duty & Circle Rate Valuation"}
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-1">
          Accurate estimation of statutory stamp duty, municipal cess, and registration fee based on district DLC rates and buyer concessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Column (6 cols) */}
        <div className="lg:col-span-6 space-y-5 bg-paper-light dark:bg-night-card p-6 border border-hairline">
          <div className="flex items-center justify-between border-b border-hairline pb-2 font-mono text-xs">
            <span className="font-bold text-forest uppercase tracking-wider">
              1. Parcel & Consideration Inputs
            </span>
            <span className="text-ink-muted">Select or Enter Values</span>
          </div>

          {/* Quick Select from Pilot Parcels */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-ink-muted uppercase text-[10px] font-bold">
              Load Pilot Parcel:
            </label>
            <select
              value={selectedUlpin}
              onChange={(e) => handleParcelSelect(e.target.value)}
              className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline text-xs font-mono"
            >
              {PARCELS_DATA.slice(0, 15).map((p) => (
                <option key={p.ulpin} value={p.ulpin}>
                  {p.ulpin} ({p.khasraNo} - {p.landUse})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-ink-muted uppercase text-[10px] font-bold">
                Area in Square Meters:
              </label>
              <input
                type="number"
                value={areaSqM}
                onChange={(e) => setAreaSqM(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline"
              />
              <div className="text-[10px] text-ink-muted">≈ {Math.round(areaSqM * 1.196)} Sq Yards</div>
            </div>

            <div className="space-y-1">
              <label className="text-ink-muted uppercase text-[10px] font-bold">
                DLC Circle Rate (₹/m²):
              </label>
              <input
                type="number"
                value={dlcRate}
                onChange={(e) => setDlcRate(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline"
              />
              <div className="text-[10px] text-ink-muted">State Gazette Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-ink-muted uppercase text-[10px] font-bold">
                Land Classification:
              </label>
              <select
                value={landType}
                onChange={(e) => setLandType(e.target.value as any)}
                className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline"
              >
                <option value="Agricultural">Agricultural</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-ink-muted uppercase text-[10px] font-bold">
                Road Frontage Width:
              </label>
              <select
                value={roadWidthMeters}
                onChange={(e) => setRoadWidthMeters(parseInt(e.target.value))}
                className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline"
              >
                <option value={9}>Under 12 meters (Standard)</option>
                <option value={18}>18 - 24 meters (+10% Premium)</option>
                <option value={30}>30+ meters Sector Road (+20% Premium)</option>
              </select>
            </div>
          </div>

          {/* Buyer Category (Rebate Selection) */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-ink-muted uppercase text-[10px] font-bold">
              Buyer Category (Statutory Concession):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBuyerCategory("general")}
                className={`p-2 border text-left ${buyerCategory === "general" ? "bg-forest text-paper border-forest font-bold" : "border-hairline bg-paper dark:bg-night-surface text-ink-muted"}`}
              >
                General Male (6%)
              </button>
              <button
                type="button"
                onClick={() => setBuyerCategory("female")}
                className={`p-2 border text-left ${buyerCategory === "female" ? "bg-forest text-paper border-forest font-bold" : "border-hairline bg-paper dark:bg-night-surface text-ink-muted"}`}
              >
                Female Buyer (5% - 1% Rebate)
              </button>
              <button
                type="button"
                onClick={() => setBuyerCategory("senior")}
                className={`p-2 border text-left ${buyerCategory === "senior" ? "bg-forest text-paper border-forest font-bold" : "border-hairline bg-paper dark:bg-night-surface text-ink-muted"}`}
              >
                Senior Citizen (5.5%)
              </button>
              <button
                type="button"
                onClick={() => setBuyerCategory("joint")}
                className={`p-2 border text-left ${buyerCategory === "joint" ? "bg-forest text-paper border-forest font-bold" : "border-hairline bg-paper dark:bg-night-surface text-ink-muted"}`}
              >
                Joint M+F (5.5%)
              </button>
            </div>
          </div>

          {/* Declared Consideration Value */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-ink-muted uppercase text-[10px] font-bold">
              Declared Agreement Value (₹):
            </label>
            <input
              type="number"
              value={declaredValue}
              onChange={(e) => setDeclaredValue(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline font-bold"
            />
            <div className="text-[10px] text-ink-muted">
              Note: Stamp duty is charged on whichever is higher between DLC Rate valuation and Declared Value.
            </div>
          </div>
        </div>

        {/* Right Output Column: Formal Calculation Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-paper dark:bg-night-surface border border-hairline space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                2. Statutory Fee Breakdown
              </span>
              <span className="text-ink-muted text-[10px]">Official SRO Estimate</span>
            </div>

            {/* Valuation Summary */}
            <div className="space-y-2 py-2 border-b border-hairline text-ink dark:text-paper">
              <div className="flex justify-between">
                <span className="text-ink-muted">Assessed DLC Benchmark:</span>
                <span>₹{calculation.assessedDlcValue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Declared Consideration:</span>
                <span>₹{declaredValue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-bold text-forest text-sm pt-1">
                <span>Taxable Assessment Value:</span>
                <span>₹{calculation.finalTaxableValue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Fees Table */}
            <div className="space-y-2.5 py-2 border-b border-hairline">
              <div className="flex justify-between text-ink dark:text-paper">
                <span>Stamp Duty ({calculation.stampRatePct}%):</span>
                <span className="font-bold">₹{calculation.baseStampDuty.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Rajasthan Cow & Infra Cess (10% on Duty):</span>
                <span>₹{calculation.surchargeCess.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-ink dark:text-paper">
                <span>Registration Fee (1%):</span>
                <span className="font-bold">₹{calculation.registrationFee.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Total Payable Banner */}
            <div className="p-4 bg-forest-faint dark:bg-forest/15 border border-forest/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-forest font-bold uppercase tracking-wider block">
                  Total Govt Stamp & Registration Fee:
                </span>
                <span className="font-serif text-2xl font-bold text-forest dark:text-[#388062]">
                  ₹{calculation.totalGovtReceipt.toLocaleString("en-IN")}
                </span>
              </div>
              <Landmark className="w-8 h-8 text-forest/70" />
            </div>

            {/* Legal Notice */}
            <div className="text-[10px] text-ink-muted leading-relaxed pt-1">
              * Rates calculated according to Finance Bill 2024 amendments under Section 3 of the Rajasthan Stamp Act. 
              Online e-Gras challan payment receipt must be presented before Sub-Registrar during physical or digital biometrics execution.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
