"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Layers,
  FileCheck2,
  Terminal,
  Activity,
  GitBranch,
  Building,
  Landmark,
  FileText,
  UserCheck,
  Compass,
  Sparkles,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sliders,
  DollarSign,
  Radio,
  Clock,
  Database,
  Satellite,
  Lock,
  ArrowUpRight,
  Eye,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { Wordmark } from "@/components/branding/Wordmark";
import { LogoMark } from "@/components/branding/LogoMark";
import { LandingHero3D } from "@/components/3d/LandingHero3D";
import { Neighborhood3D } from "@/components/3d/Neighborhood3D";
import { ContourCursorCanvas } from "@/components/ui/ContourCursorCanvas";
import { useApp } from "@/components/providers/AppProvider";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { VerifiedStamp } from "@/components/branding/VerifiedStamp";

export default function HomePage() {
  const router = useRouter();
  const { lang, t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [active3dTab, setActive3dTab] = useState<"terrain" | "neighborhood">("terrain");
  const [activeFilter, setActiveFilter] = useState<"all" | "anomalies" | "agricultural" | "commercial">("all");
  const [selectedDeptSilo, setSelectedDeptSilo] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredParcels = PARCELS_DATA.filter((p) => {
    if (activeFilter === "anomalies") return p.inconsistencies.length > 0;
    if (activeFilter === "agricultural") return p.landUse === "Agricultural";
    if (activeFilter === "commercial") return p.landUse === "Commercial";
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const matched = PARCELS_DATA.find(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.owners.some(
          (o) =>
            o.name.toLowerCase().includes(q) ||
            o.hindiName.includes(q)
        )
    );
    if (matched) {
      router.push(`/parcel/${matched.ulpin}`);
    } else {
      router.push(`/parcel/RJ08040001001A`);
    }
  };

  const departments = [
    {
      name: "Revenue Department",
      hindiName: "राजस्व विभाग (जमाबंदी)",
      role: "Jamabandi, Khasra Cadastre & Mutation Ledger",
      icon: Landmark,
      color: "border-forest text-forest bg-forest/5",
      badge: "Khasra Authority",
      detail: "Maintains ownership records, khasra map boundaries, and historical mutations.",
    },
    {
      name: "Registration & Stamps",
      hindiName: "पंजीयन एवं मुद्रांक (उप-पंजीयक)",
      role: "Deed Registration & Stamp Duty Verification",
      icon: FileCheck2,
      color: "border-ochre text-ochre bg-ochre/5",
      badge: "Deed Registry",
      detail: "Executes sale deeds, mortgages, encumbrances, and stamp duty collection.",
    },
    {
      name: "Town Planning / JDA",
      hindiName: "नगर नियोजन एवं विकास प्राधिकरण",
      role: "Master Plan Zoning, FAR & Green Belt Protections",
      icon: Building,
      color: "border-[#2F658C] text-[#2F658C] bg-[#2F658C]/5",
      badge: "Zoning & FAR",
      detail: "Regulates land-use zones, maximum permissible floors, and road right-of-way.",
    },
    {
      name: "Municipal Corporation",
      hindiName: "नगर निगम / स्थानीय निकाय",
      role: "Property Tax Assessment & Utility Connections",
      icon: Database,
      color: "border-[#665C7B] text-[#665C7B] bg-[#665C7B]/5",
      badge: "Tax & Utilities",
      detail: "Levies urban property tax, tracks arrears, and issues door-to-door utility IDs.",
    },
  ];

  return (
    <div className="relative w-full space-y-16 pb-28 overflow-hidden">
      {/* Living Topographic Cursor Contour Canvas */}
      <ContourCursorCanvas />

      {/* Top Telemetry Live Stream Ticker */}
      <div className="relative z-10 border-b border-hairline bg-paper-light/90 dark:bg-night-card/90 backdrop-blur-md py-2 px-4 font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-forest animate-ping shrink-0" />
          <span className="font-bold text-forest">LIVE CADASTRAL FEED</span>
          <span className="text-ink-faint">|</span>
          <span className="truncate">
            PILOT ZONE: JAIPUR (SANGANER + WARD 14) • 40 GEODETIC VECTORS • 8 INCONSISTENCIES FLAGGED • ISO 19152 LADM
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-ink-muted shrink-0">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-forest animate-pulse" />
            <span>RTK-GPS: ±2CM</span>
          </span>
          <span>EPSG:4326</span>
          <span className="font-bold text-ink dark:text-paper bg-paper-dark dark:bg-night px-2 py-0.5 border border-hairline">
            {currentTime || "12:00:00 IST"}
          </span>
        </div>
      </div>

      {/* 1. Master Command Center Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission, Branding & Universal Search (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* National Cadastral Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-forest/40 bg-forest-faint dark:bg-forest/15 text-forest text-xs font-mono uppercase tracking-wider font-semibold shadow-xs">
              <Compass className="w-3.5 h-3.5 text-forest" />
              <span>National Land Stack Prototype • Rajasthan</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink dark:text-paper leading-[1.06]">
                {lang === "hi" ? (
                  <>
                    एक ज़मीन।<br />
                    <span className="text-forest dark:text-[#388062]">एक पहचान।</span><br />
                    सब विभाग।
                  </>
                ) : (
                  <>
                    One parcel.<br />
                    <span className="text-forest dark:text-[#388062]">One identity.</span><br />
                    Every department.
                  </>
                )}
              </h1>
              <p className="font-sans text-base sm:text-lg text-ink-light dark:text-paper/85 max-w-lg leading-relaxed">
                {lang === "hi"
                  ? "विखंडित भू-अभिलेखों का सार्वभौमिक समाधान: ULPIN पर आधारित डिजिटल सार्वजनिक अवसंरचना, अंतर-विभागीय समन्वय, एवं पारदर्शी नागरिक सेवाएं।"
                  : "A unified parcel-level Digital Public Infrastructure for land governance in India. Bridging revenue jamabandi, sub-registrar deeds, master plan zoning, and municipal taxation into an immutable multi-tier stack."}
              </p>
            </div>

            {/* High-Tech Search Bar with Instant Autocomplete Chips */}
            <form onSubmit={handleSearch} className="space-y-2 pt-1">
              <div className="flex border-2 border-forest/70 bg-paper-light dark:bg-night-card focus-within:border-forest transition-all shadow-md">
                <div className="pl-3.5 flex items-center pointer-events-none text-forest">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === "hi"
                      ? "ULPIN (उदा. RJ08040001001A), खसरा संख्या, या नाम..."
                      : "Enter ULPIN (e.g. RJ08040001001A), Khasra no, or Owner..."
                  }
                  className="w-full px-3 py-3.5 text-xs font-mono bg-transparent text-ink dark:text-paper placeholder-ink-faint focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-forest hover:bg-forest-hover text-paper text-xs font-mono uppercase tracking-wider font-bold border-l border-forest transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <span>{lang === "hi" ? "खोजें" : "Search"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick sample chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-ink-muted pt-1">
                <span className="font-bold text-ink dark:text-paper text-[10px] uppercase">Quick Targets:</span>
                <button
                  type="button"
                  onClick={() => router.push("/parcel/RJ08040001001A")}
                  className="px-2 py-0.5 border border-surveyRed/40 bg-surveyRed/5 text-surveyRed hover:bg-surveyRed hover:text-white transition-colors flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Khasra 142/1 (Overlap Anomaly)</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/parcel/RJ08040001004A")}
                  className="px-2 py-0.5 border border-ochre/40 bg-ochre/5 text-ochre hover:bg-ochre hover:text-white transition-colors"
                >
                  Khasra 144/1 (Registry Gap)
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/parcel/RJ08040001009A")}
                  className="px-2 py-0.5 border border-forest/40 bg-forest/5 text-forest hover:bg-forest hover:text-paper transition-colors"
                >
                  Ward 14 (Verified Title)
                </button>
              </div>
            </form>

            {/* Fast Access Command Buttons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                href="/parcel/RJ08040001001A"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest text-paper font-mono text-xs font-bold uppercase tracking-wider hover:bg-forest-hover transition-all shadow-md hover:shadow-lg"
              >
                <span>Launch 360° Cadastre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/conflict-radar"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-paper dark:bg-night-surface border border-surveyRed/60 font-mono text-xs font-bold uppercase tracking-wider text-surveyRed hover:bg-surveyRed hover:text-paper transition-all shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Conflict Radar (8)</span>
              </Link>
              <Link
                href="/domino"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-paper dark:bg-night-surface border border-hairline font-mono text-xs font-semibold uppercase tracking-wider text-ink dark:text-paper hover:border-forest transition-colors shadow-sm"
              >
                <Activity className="w-3.5 h-3.5 text-forest" />
                <span>Domino Mutation</span>
              </Link>
            </div>

            {/* Live Infrastructure Trust Seal Banner */}
            <div className="border border-hairline bg-paper-light/60 dark:bg-night-card/60 p-3 font-mono text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-forest shrink-0" />
                <div>
                  <div className="font-bold text-[11px] text-ink dark:text-paper uppercase">
                    Tamper-Evident SHA-256 Ledger
                  </div>
                  <div className="text-[10px] text-ink-muted">
                    Cryptographically stamped by State Revenue & Sub-Registrar
                  </div>
                </div>
              </div>
              <Link
                href="/audit-trail"
                className="text-[10px] text-forest underline font-bold uppercase shrink-0 hover:text-forest-hover"
              >
                Audit Log →
              </Link>
            </div>
          </div>

          {/* Right Column: 3D High-Fidelity Spatial Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-2">
            
            {/* 3D Tab Switcher Dock */}
            <div className="flex items-center justify-between font-mono text-xs pb-1">
              <div className="flex items-center border border-hairline bg-paper-light dark:bg-night-card p-0.5 shadow-sm">
                <button
                  onClick={() => setActive3dTab("terrain")}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                    active3dTab === "terrain"
                      ? "bg-forest text-paper"
                      : "text-ink-muted hover:text-ink dark:hover:text-paper"
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>3D Topo Terrain & LiDAR</span>
                </button>
                <button
                  onClick={() => setActive3dTab("neighborhood")}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                    active3dTab === "neighborhood"
                      ? "bg-forest text-paper"
                      : "text-ink-muted hover:text-ink dark:hover:text-paper"
                  }`}
                >
                  <Building className="w-3 h-3" />
                  <span>3D Urban Zoning & FAR</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-forest font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-forest animate-ping" />
                <span>WebGL 3D Engine Active</span>
              </div>
            </div>

            {/* 3D Scene Viewport */}
            {active3dTab === "terrain" ? (
              <LandingHero3D />
            ) : (
              <Neighborhood3D initialHighlightAnomalies={true} />
            )}
          </div>

        </div>
      </section>

      {/* 2. Key Metrics & Odometer Telemetry Strip */}
      <section className="relative z-10 border-y border-hairline bg-paper-light/95 dark:bg-night-card/95 py-6 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono divide-y md:divide-y-0 md:divide-x divide-hairline">
            
            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-forest">
                40
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-paper">
                Pilot Parcels Digitized
              </div>
              <div className="text-[9px] text-ink-muted">
                100% Georeferenced Jaipur pilot (Sanganer + Ward 14)
              </div>
            </div>

            <div className="p-2 space-y-1 pt-4 md:pt-2">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-surveyRed flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-6 h-6 text-surveyRed" />
                <span>8</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-paper">
                Cross-Dept Conflicts
              </div>
              <div className="text-[9px] text-ink-muted">
                Automated spatial & deed discrepancies surfaced
              </div>
            </div>

            <div className="p-2 space-y-1 pt-4 md:pt-2">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-ochre">
                ₹142.8 Cr
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-paper">
                Dispute Value Shielded
              </div>
              <div className="text-[9px] text-ink-muted">
                Capital protected from predatory encumbrances
              </div>
            </div>

            <div className="p-2 space-y-1 pt-4 md:pt-2">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-forest">
                4.2s
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-paper">
                Domino Mutation Speed
              </div>
              <div className="text-[9px] text-ink-muted">
                Down from 45 days traditional registry latency
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The 4 Departmental Silos -> 1 Single ULPIN Stack Visualizer */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-hairline bg-paper-light dark:bg-night-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-forest/10 text-forest text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
                <Layers className="w-3 h-3" />
                <span>Architecture of Convergence</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-paper">
                From 4 Isolated Silos into 1 Unified DPI
              </h2>
              <p className="font-mono text-xs text-ink-muted mt-1 max-w-2xl">
                Traditional Indian land records exist in isolated government databases. Plotline binds every layer to an immutable 14-digit Bhu-Aadhaar (ULPIN).
              </p>
            </div>

            <Link
              href="/standards"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-forest hover:text-forest-hover uppercase tracking-wider shrink-0"
            >
              <span>View System Standards</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Silo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept, idx) => {
              const IconComp = dept.icon;
              const isSelected = selectedDeptSilo === idx;
              return (
                <div
                  key={dept.name}
                  onClick={() => setSelectedDeptSilo(idx)}
                  className={`cursor-pointer p-4 border transition-all duration-200 ${
                    isSelected
                      ? "border-forest bg-paper dark:bg-night-surface ring-2 ring-forest/30 shadow-md"
                      : "border-hairline bg-paper/60 dark:bg-night-surface/60 hover:border-forest/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 border ${dept.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 border border-hairline bg-paper-light dark:bg-night">
                      {dept.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-ink dark:text-paper">
                    {dept.name}
                  </h3>
                  <div className="text-[10px] font-hindi text-ink-muted mt-0.5">
                    {dept.hindiName}
                  </div>
                  <p className="font-mono text-[11px] text-ink-light dark:text-paper/80 mt-2 line-clamp-2">
                    {dept.detail}
                  </p>
                  <div className="mt-3 pt-2 border-t border-hairline flex items-center justify-between text-[10px] font-mono">
                    <span className="text-forest font-bold">Converged Layer #{idx + 1}</span>
                    <span className="text-ink-muted">Live Sync ✓</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Convergence Result Bar */}
          <div className="bg-forest-faint dark:bg-forest/15 border border-forest/30 p-4 font-mono text-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-forest text-paper shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <span className="text-forest font-bold uppercase text-[11px] tracking-wider block">
                  The Result: Unique Land Parcel Identification Number (ULPIN)
                </span>
                <span className="text-ink-muted dark:text-paper/80 text-[11px]">
                  Sample: <strong className="text-ink dark:text-paper">RJ08040001001A</strong> — Geocoded centroid + multi-department cryptographically signed ledger.
                </span>
              </div>
            </div>

            <Link
              href="/parcel/RJ08040001001A"
              className="px-4 py-2 bg-forest hover:bg-forest-hover text-paper text-xs uppercase font-bold tracking-wider shrink-0 transition-colors"
            >
              Inspect Sample ULPIN →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Complete Land Stack DPI Toolkit (6 Core Engines) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-hairline pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-forest/10 text-forest text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
              <Terminal className="w-3 h-3" />
              <span>Full DPI Suite</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-paper">
              Autonomous Governance Tools
            </h2>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Production modules built for Revenue Officers, Sub-Registrars, and Citizens.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-mono font-bold text-forest hover:text-forest-hover uppercase tracking-wider flex items-center gap-1"
          >
            <span>Officer Command Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          
          {/* Card 1: Conflict Radar */}
          <Link
            href="/conflict-radar"
            className="group block p-5 border border-hairline bg-paper-light dark:bg-night-card hover:border-surveyRed transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 border border-surveyRed/40 bg-surveyRed/10 text-surveyRed">
                <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-surveyRed text-white">
                8 Active Anomalies
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper group-hover:text-surveyRed transition-colors">
              Conflict Radar Engine
            </h3>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Automated spatial polygon overlap detection, revenue-registry area mismatches, and master plan green belt encroachments.
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs text-surveyRed font-bold">
              <span>Launch Anomaly Scanner</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Domino Sale Tracker */}
          <Link
            href="/domino"
            className="group block p-5 border border-hairline bg-paper-light dark:bg-night-card hover:border-forest transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 border border-forest/40 bg-forest/10 text-forest">
                <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-forest text-paper">
                Zero Human Latency
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper group-hover:text-forest transition-colors">
              Domino Mutation Tracker
            </h3>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Real-time multi-department workflow: from agreement to biometric e-sign, instant circle rate stamp duty, to automated jamabandi update.
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs text-forest font-bold">
              <span>Trace Pipeline Steps</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Subdivision Simulator */}
          <Link
            href="/subdivision"
            className="group block p-5 border border-hairline bg-paper-light dark:bg-night-card hover:border-ochre transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 border border-ochre/40 bg-ochre/10 text-ochre">
                <GitBranch className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-ochre text-white">
                Turf.js Geometric Severance
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper group-hover:text-ochre transition-colors">
              Subdivision Simulator
            </h3>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Split parent parcels into child polygons with instant area recalculation, road access verification, and automated child ULPIN generation.
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs text-ochre font-bold">
              <span>Sever Parcel in 3D</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Circle Rate DLC Valuation */}
          <Link
            href="/calculator"
            className="group block p-5 border border-hairline bg-paper-light dark:bg-night-card hover:border-forest transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 border border-forest/40 bg-forest/10 text-forest">
                <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-paper-dark dark:bg-night text-ink dark:text-paper border border-hairline">
                Rajasthan DLC Rates
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper group-hover:text-forest transition-colors">
              Circle Rate & Tax Calculator
            </h3>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Official District Level Committee valuation calculator with road width multipliers and Rajasthan 1% female owner stamp concession rebate.
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs text-forest font-bold">
              <span>Calculate Stamp Duty</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 5: Satellite Change Detection */}
          <Link
            href="/change-detection"
            className="group block p-5 border border-hairline bg-paper-light dark:bg-night-card hover:border-forest transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 border border-forest/40 bg-forest/10 text-forest">
                <Satellite className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-paper-dark dark:bg-night text-ink dark:text-paper border border-hairline">
                Sentinel-2 & Drone
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper group-hover:text-forest transition-colors">
              Satellite Change Detection
            </h3>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Temporal split-slider comparison of cadastral boundaries against 2021 vs 2024 satellite imagery for illegal construction detection.
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs text-forest font-bold">
              <span>Compare Satellite Split</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 6: Tamper-Evident Title Deed */}
          <Link
            href="/verify/DEED-2024-RJ-0804-001"
            className="group block p-5 border border-hairline bg-paper-light dark:bg-night-card hover:border-forest transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 border border-forest/40 bg-forest/10 text-forest">
                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-forest text-paper">
                Verified Stamp
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper group-hover:text-forest transition-colors">
              Tamper-Evident Title Deed
            </h3>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Official citizen-facing property passport with animated rubber-stamp authentication, SHA-256 integrity hash, and offline QR code.
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs text-forest font-bold">
              <span>Inspect Verified Deed</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

        </div>
      </section>

      {/* 5. Live Cadastral Registry Browser & Quick Filter */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-forest/10 text-forest text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
              <Database className="w-3 h-3" />
              <span>Rajasthan Pilot Registry</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-paper">
              Georeferenced Parcel Registry ({filteredParcels.length})
            </h2>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Select any parcel to open its comprehensive 360° cadastre dossier.
            </p>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex items-center border border-hairline bg-paper-light dark:bg-night-card p-0.5 font-mono text-xs shadow-xs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase transition-colors ${
                activeFilter === "all" ? "bg-forest text-paper" : "text-ink-muted hover:text-ink"
              }`}
            >
              All Parcels ({PARCELS_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter("anomalies")}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase flex items-center gap-1 transition-colors ${
                activeFilter === "anomalies" ? "bg-surveyRed text-white" : "text-surveyRed hover:bg-surveyRed/10"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Anomalies (8)</span>
            </button>
            <button
              onClick={() => setActiveFilter("agricultural")}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase transition-colors ${
                activeFilter === "agricultural" ? "bg-forest text-paper" : "text-ink-muted hover:text-ink"
              }`}
            >
              Agricultural
            </button>
            <button
              onClick={() => setActiveFilter("commercial")}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase transition-colors ${
                activeFilter === "commercial" ? "bg-forest text-paper" : "text-ink-muted hover:text-ink"
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Parcels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {filteredParcels.slice(0, 12).map((parcel) => {
            const hasAnomaly = parcel.inconsistencies.length > 0;
            return (
              <div
                key={parcel.ulpin}
                className={`p-4 border transition-all duration-200 bg-paper-light dark:bg-night-card flex flex-col justify-between ${
                  hasAnomaly
                    ? "border-surveyRed/50 hover:border-surveyRed hover:shadow-md"
                    : "border-hairline hover:border-forest hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] text-forest font-bold truncate">
                      {parcel.ulpin}
                    </span>
                    <span
                      className={`text-[8px] uppercase font-bold px-1.5 py-0.5 border ${
                        hasAnomaly
                          ? "bg-surveyRed/10 text-surveyRed border-surveyRed/30"
                          : "bg-forest/10 text-forest border-forest/30"
                      }`}
                    >
                      {hasAnomaly ? "Anomaly" : "Verified"}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-ink dark:text-paper leading-tight">
                    {parcel.khasraNo} • {parcel.village}
                  </h4>
                  <div className="text-[10px] text-ink-muted mt-0.5 truncate">
                    {parcel.owners.map((o) => o.name).join(", ")}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-hairline text-[10px]">
                    <div>
                      <span className="text-ink-faint block text-[8px] uppercase">Land Use</span>
                      <span className="font-bold text-ink dark:text-paper">{parcel.landUse}</span>
                    </div>
                    <div>
                      <span className="text-ink-faint block text-[8px] uppercase">Area (m²)</span>
                      <span className="font-bold text-ink dark:text-paper">
                        {parcel.areaSqM.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between gap-2">
                  <Link
                    href={`/health/${parcel.ulpin}`}
                    className="text-[10px] text-ink-muted hover:text-forest font-semibold"
                  >
                    Audit
                  </Link>
                  <Link
                    href={`/parcel/${parcel.ulpin}`}
                    className="px-2.5 py-1 bg-forest hover:bg-forest-hover text-paper text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <span>360° Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all button */}
        <div className="text-center pt-2">
          <Link
            href="/parcel/RJ08040001001A"
            className="inline-flex items-center gap-2 px-6 py-3 border border-forest text-forest hover:bg-forest hover:text-paper font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Explore All 40 Parcels in Interactive Map View</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Citizen & Officer Services Bottom Callout */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest text-paper p-8 sm:p-12 relative overflow-hidden shadow-xl border border-forest-dark">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Compass className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper/15 text-paper text-xs font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-ochre" />
              <span>Citizen Empowerment Layer</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Transparent Land Governance. Instant Public Services.
            </h2>

            <p className="font-sans text-paper/85 text-sm sm:text-base leading-relaxed">
              Order verified physical boundary demarcations, check encumbrance certificates, run simulated subdivisions, and track mutation dominoes directly from your smartphone.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs font-bold uppercase tracking-wider">
              <Link
                href="/services"
                className="px-5 py-3 bg-paper text-forest hover:bg-paper-light transition-colors shadow-md flex items-center gap-1.5"
              >
                <span>Request Citizen Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/api-console"
                className="px-5 py-3 border border-paper/40 hover:bg-paper/10 text-paper transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open API Sandbox</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
