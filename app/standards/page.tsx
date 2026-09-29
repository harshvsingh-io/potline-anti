"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  ShieldCheck,
  Palette,
  Server,
  Key,
  Compass,
  FileCode,
} from "lucide-react";
import { Wordmark } from "@/components/branding/Wordmark";
import { LogoMark } from "@/components/branding/LogoMark";
import { useApp } from "@/components/providers/AppProvider";

export default function StandardsPage() {
  const { lang } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="border-b border-hairline pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
            Technical Specification & Standards
          </span>
          <span className="font-mono text-xs text-ink-muted">
            National Land Stack Architecture Blueprint v1.0
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
          {lang === "hi" ? "मानक एवं तकनीकी वास्तुकला" : "Plotline Standards & Architecture Specification"}
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-1">
          Reference blueprint detailing system architecture, ISO 19152 LADM data schema, PostGIS GIS specifications, RBAC security, and cartographic design tokens.
        </p>
      </div>

      {/* 1. System Architecture Clean SVG Diagram */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-forest" />
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper">
            1. System Architecture Diagram
          </h2>
        </div>

        <div className="border border-hairline bg-paper-light dark:bg-night-card p-6 overflow-x-auto">
          <svg className="w-full max-w-4xl mx-auto" viewBox="0 0 800 480" fill="none">
            {/* Background grid */}
            <rect width="800" height="480" fill="#FCFAF6" className="dark:fill-[#17231E]" stroke="#D8D0C0" strokeWidth="1" />

            {/* Top Consumer Layer */}
            <rect x="50" y="30" width="700" height="60" fill="#EBF3EF" stroke="#1F4D3A" strokeWidth="1.5" />
            <text x="400" y="55" textAnchor="middle" fill="#1F4D3A" fontFamily="sans-serif" fontWeight="bold" fontSize="13">
              PRESENTATION LAYER & SERVICE CONSUMERS
            </text>
            <text x="400" y="74" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="10">
              Citizen Web Portal • Mobile PWA • Officer Desks • Commercial Bank CERSAI Client • Open REST APIs
            </text>

            {/* Connector Lines */}
            <line x1="400" y1="90" x2="400" y2="120" stroke="#1F4D3A" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Land Stack 3-Tier Core Engine */}
            <rect x="50" y="120" width="700" height="230" fill="#F4EFE6" className="dark:fill-[#121B17]" stroke="#1B2621" strokeWidth="1.5" />
            <text x="400" y="145" textAnchor="middle" fill="#1B2621" fontFamily="Georgia, serif" fontWeight="bold" fontSize="15">
              LAND STACK DPI CORE (ULPIN ANCHOR ENGINE)
            </text>

            {/* Tier 1: Base */}
            <rect x="80" y="165" width="200" height="160" fill="#FFFFFF" className="dark:fill-[#1A2621]" stroke="#1F4D3A" strokeWidth="1.2" />
            <text x="180" y="190" textAnchor="middle" fill="#1F4D3A" fontFamily="monospace" fontWeight="bold" fontSize="11">TIER 1: BASE</text>
            <text x="180" y="210" textAnchor="middle" fill="#1B2621" fontFamily="sans-serif" fontSize="10">Cadastral Boundary Vector</text>
            <text x="180" y="226" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">14-char ULPIN Bhu-Aadhaar</text>
            <text x="180" y="242" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">ETS / Drone Ground Pins</text>
            <text x="180" y="258" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">WGS84 EPSG:4326</text>
            <text x="180" y="295" textAnchor="middle" fill="#1F4D3A" fontFamily="monospace" fontSize="9" fontWeight="bold">Custodian: DLRS</text>

            {/* Tier 2: Essential */}
            <rect x="300" y="165" width="200" height="160" fill="#FFFFFF" className="dark:fill-[#1A2621]" stroke="#C9922E" strokeWidth="1.2" />
            <text x="400" y="190" textAnchor="middle" fill="#C9922E" fontFamily="monospace" fontWeight="bold" fontSize="11">TIER 2: ESSENTIAL</text>
            <text x="400" y="210" textAnchor="middle" fill="#1B2621" fontFamily="sans-serif" fontSize="10">Jamabandi Record of Rights</text>
            <text x="400" y="226" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">Sub-Registrar Deeds (Book 1)</text>
            <text x="400" y="242" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">CERSAI Bank Liens</text>
            <text x="400" y="258" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">Master Plan Zoning (JDA)</text>
            <text x="400" y="295" textAnchor="middle" fill="#C9922E" fontFamily="monospace" fontSize="9" fontWeight="bold">Custodians: Revenue / Reg / Banks</text>

            {/* Tier 3: Use-Case */}
            <rect x="520" y="165" width="200" height="160" fill="#FFFFFF" className="dark:fill-[#1A2621]" stroke="#5B6770" strokeWidth="1.2" />
            <text x="620" y="190" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontWeight="bold" fontSize="11">TIER 3: USE-CASE</text>
            <text x="620" y="210" textAnchor="middle" fill="#1B2621" fontFamily="sans-serif" fontSize="10">Municipal Property Tax Ledger</text>
            <text x="620" y="226" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">DLC Circle Rate Valuation</text>
            <text x="620" y="242" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">JVVNL & PHED Consumer IDs</text>
            <text x="620" y="258" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9">100-yr HFL Flood Buffers</text>
            <text x="620" y="295" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="9" fontWeight="bold">Custodians: JMC / Utilities / NGT</text>

            {/* Bottom Persistence & Security Layer */}
            <line x1="400" y1="350" x2="400" y2="380" stroke="#1F4D3A" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="50" y="380" width="700" height="70" fill="#EAE2D5" className="dark:fill-[#1F2D26]" stroke="#1B2621" strokeWidth="1.2" />
            <text x="400" y="405" textAnchor="middle" fill="#1B2621" fontFamily="monospace" fontWeight="bold" fontSize="11">
              POSTGRESQL + POSTGIS STORAGE & IMMUTABLE AUDIT LOG
            </text>
            <text x="400" y="425" textAnchor="middle" fill="#5B6770" fontFamily="monospace" fontSize="10">
              Row Level Security (RLS) • PostGIS Topology Primitives • PostgreSQL Trigger Ledger • Supabase Realtime
            </text>
          </svg>
        </div>
      </section>

      {/* 2. GIS & Cadastral Standards */}
      <section className="space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-forest" />
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper">
            2. Spatial & Cadastral Standards
          </h2>
        </div>

        <div className="p-5 border border-hairline bg-paper dark:bg-night-card space-y-3 leading-relaxed">
          <div>
            <strong className="text-forest uppercase text-[11px] block">ULPIN Format Specification:</strong>
            14-character alphanumeric string generated from centroid coordinates (e.g. `RJ08040001001A`): State Code (2) + District Code (2) + Tehsil Code (2) + Village Code (4) + Parcel Sequential ID (3) + Check Character (1).
          </div>
          <div>
            <strong className="text-forest uppercase text-[11px] block">Coordinate Reference System (CRS):</strong>
            EPSG:4326 (WGS84 Lat/Lng) for universal web delivery; EPSG:32643 (UTM Zone 43N) for precise metric area calculations via Turf.js.
          </div>
          <div>
            <strong className="text-forest uppercase text-[11px] block">Boundary Accuracy & Tolerance:</strong>
            Zero polygon self-intersection; maximum permissible deviation between GIS digitized polygon area and RoR paper Jamabandi is &plusmn;2.0% for agricultural land and &plusmn;0.5% for urban layouts.
          </div>
        </div>
      </section>

      {/* 3. Security Model: RBAC & Audit Ledger */}
      <section className="space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-forest" />
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper">
            3. Security Model (Authentication, RBAC & Auditability)
          </h2>
        </div>

        <div className="p-5 border border-hairline bg-paper dark:bg-night-card space-y-3 leading-relaxed">
          <div>
            <strong className="text-forest uppercase text-[11px] block">Row Level Security (RLS):</strong>
            All PostgreSQL tables enforce RLS policies. Public reads allow open title verification; write operations require JWT authentication signed with authorized department officer claims.
          </div>
          <div>
            <strong className="text-forest uppercase text-[11px] block">Immutable Audit Triggers:</strong>
            Any UPDATE or DELETE on parcels or ownership tables triggers an automatic INSERT into the `audit_logs` table with actor, role, IP address, and SHA-256 hash. The audit table has RLS policies prohibiting all UPDATE and DELETE operations.
          </div>
        </div>
      </section>

      {/* 4. UI/UX Design System Tokens */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-forest" />
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper">
            4. Cartographic Design Tokens
          </h2>
        </div>

        <div className="border border-hairline bg-paper dark:bg-night-card p-5 space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 border border-hairline bg-[#F4EFE6] text-[#1B2621]">
              <div className="font-bold">Paper Off-White</div>
              <div className="text-[10px]">#F4EFE6 (Base Canvas)</div>
            </div>
            <div className="p-3 border border-hairline bg-[#1B2621] text-[#F4EFE6]">
              <div className="font-bold">Ink Black</div>
              <div className="text-[10px]">#1B2621 (Primary Text)</div>
            </div>
            <div className="p-3 border border-hairline bg-[#1F4D3A] text-[#F4EFE6]">
              <div className="font-bold">Forest Green</div>
              <div className="text-[10px]">#1F4D3A (Primary Accent)</div>
            </div>
            <div className="p-3 border border-hairline bg-[#B3372A] text-[#F4EFE6]">
              <div className="font-bold">Survey Red</div>
              <div className="text-[10px]">#B3372A (Alerts & Stamps)</div>
            </div>
          </div>

          <div className="pt-2 border-t border-hairline text-[11px] text-ink-muted">
            Strict styling rules: 1px hairline borders (`border-hairline`), max 4px corner radius, Fraunces serif headings, IBM Plex Sans body, IBM Plex Mono for ULPIN & IDs, Noto Sans Devanagari for Hindi.
          </div>
        </div>
      </section>

    </div>
  );
}
