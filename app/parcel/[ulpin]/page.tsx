"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  MapPin,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  Building,
  Landmark,
  FileCheck2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Sliders,
  DollarSign,
  Download,
  Share2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { RiskGauge } from "@/components/health/RiskGauge";
import { saveParcelToOfflineCache } from "@/lib/offlineCache";
import { useApp } from "@/components/providers/AppProvider";

const ParcelMap2D = dynamic(
  () => import("@/components/map/ParcelMap2D").then((m) => m.ParcelMap2D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] bg-paper-dark dark:bg-night-surface border border-hairline flex items-center justify-center font-mono text-xs text-ink-muted">
        Loading Cadastral Vector Map...
      </div>
    ),
  }
);

const LayerStack3DModal = dynamic(
  () => import("@/components/3d/LayerStack3D").then((m) => m.LayerStack3DModal),
  { ssr: false }
);

type TabType =
  | "overview"
  | "ownership"
  | "registration"
  | "encumbrance"
  | "zoning"
  | "tax"
  | "utilities"
  | "timeline"
  | "documents";

export default function ParcelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { lang, t } = useApp();
  const ulpinParam = (params?.ulpin as string) || "RJ08040001001A";

  const [parcel, setParcel] = useState<ParcelData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [layerModalOpen, setLayerModalOpen] = useState(false);

  useEffect(() => {
    const found = PARCELS_DATA.find(
      (p) => p.ulpin.toUpperCase() === ulpinParam.toUpperCase()
    ) || PARCELS_DATA[0];
    setParcel(found);
    if (found) {
      document.title = `Parcel ${found.ulpin} | Plotline`;
      saveParcelToOfflineCache(found);
    }
  }, [ulpinParam]);

  if (!parcel) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center font-mono text-sm">
        Loading parcel {ulpinParam}...
      </div>
    );
  }

  const hasInconsistencies = parcel.inconsistencies.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Bar: Identity & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              {parcel.landUse} Parcel
            </span>
            <span className="font-mono text-xs text-ink-muted">
              {parcel.village}, Tehsil {parcel.tehsil}, {parcel.district}
            </span>
            {hasInconsistencies && (
              <span className="px-2 py-0.5 bg-surveyRed-faint text-surveyRed border border-surveyRed/30 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Cross-Layer Anomaly Flagged
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            Parcel {parcel.ulpin}
          </h1>
          <div className="font-mono text-xs text-ink-muted mt-1">
            Khasra / Survey: <strong className="text-ink dark:text-paper">{parcel.khasraNo}</strong> ({parcel.surveyNo}) • Digitized Area: <strong className="text-ink dark:text-paper">{parcel.areaSqM} m²</strong> ({parcel.areaOriginal})
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Signature 3D Layer Stack View Button */}
          <button
            onClick={() => setLayerModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs font-semibold uppercase tracking-wider border border-forest transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Layers</span>
          </button>

          <Link
            href={`/health/${parcel.ulpin}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-paper dark:bg-night-surface hover:bg-paper-light border border-hairline font-mono text-xs font-semibold uppercase tracking-wider text-ink dark:text-paper transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>Health Report</span>
          </Link>

          <Link
            href={`/subdivision?ulpin=${parcel.ulpin}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-paper dark:bg-night-surface hover:bg-paper-light border border-hairline font-mono text-xs font-semibold uppercase tracking-wider text-ink dark:text-paper transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-ochre" />
            <span>Subdivide</span>
          </Link>

          <Link
            href={`/compare?p1=${parcel.ulpin}`}
            className="inline-flex items-center gap-2 px-3 py-2 bg-paper dark:bg-night-surface hover:bg-paper-light border border-hairline font-mono text-xs text-ink-muted hover:text-ink transition-colors"
            title="Compare with another parcel"
          >
            <span>Compare</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Workspace: Map (Left 6 cols) + Multi-Department Inspector (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 2D GIS Cadastral Map */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-hairline bg-paper-light dark:bg-night-card p-3 flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Cadastral Spatial Boundary
            </span>
            <span className="text-ink-muted">
              Centroid: {parcel.centroid[0].toFixed(4)}, {parcel.centroid[1].toFixed(4)}
            </span>
          </div>

          <ParcelMap2D
            selectedUlpin={parcel.ulpin}
            onSelectParcel={(p) => router.push(`/parcel/${p.ulpin}`)}
            height="460px"
          />

          {/* Quick Risk Preview Gauge */}
          <RiskGauge
            score={parcel.disputeRiskScore}
            factors={parcel.disputeRiskFactors || parcel.riskFactors || []}
          />
        </div>

        {/* Right Column: Multi-Department Tabs Panel */}
        <div className="lg:col-span-6 flex flex-col border border-hairline bg-paper dark:bg-night-surface">
          
          {/* Tab Navigation Ribbon */}
          <div className="flex border-b border-hairline bg-paper-light dark:bg-night-card overflow-x-auto text-xs font-mono">
            {[
              { id: "overview", label: "Overview" },
              { id: "ownership", label: "Ownership (RoR)" },
              { id: "registration", label: "Registry (Deeds)" },
              { id: "encumbrance", label: "Encumbrance" },
              { id: "zoning", label: "Zoning & Permits" },
              { id: "tax", label: "Tax & Dues" },
              { id: "utilities", label: "Utilities" },
              { id: "timeline", label: "Timeline" },
              { id: "documents", label: "Vault" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-2.5 whitespace-nowrap font-medium transition-colors border-r border-hairline last:border-none ${
                  activeTab === tab.id
                    ? "bg-paper dark:bg-night-surface font-bold text-forest border-b-2 border-b-forest"
                    : "text-ink-muted hover:text-ink dark:hover:text-paper"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
            
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="p-3 bg-paper-light dark:bg-night-card border border-hairline space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-forest font-bold">
                    Cadastral Attributes (Base Tier)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-ink dark:text-paper">
                    <div><span className="text-ink-muted">ULPIN:</span> {parcel.ulpin}</div>
                    <div><span className="text-ink-muted">Survey No:</span> {parcel.surveyNo}</div>
                    <div><span className="text-ink-muted">Village:</span> {parcel.village}</div>
                    <div><span className="text-ink-muted">Tehsil:</span> {parcel.tehsil}</div>
                    <div><span className="text-ink-muted">Digitized Area:</span> {parcel.areaSqM} m²</div>
                    <div><span className="text-ink-muted">Paper Area:</span> {parcel.areaOriginal}</div>
                    <div><span className="text-ink-muted">Elevation:</span> {parcel.elevationMeters}m MSL</div>
                    <div><span className="text-ink-muted">Road Frontage:</span> {parcel.roadWidthMeters}m</div>
                  </div>
                </div>

                {hasInconsistencies && (
                  <div className="p-3 bg-surveyRed-faint border border-surveyRed/40 text-surveyRed space-y-1">
                    <div className="font-bold flex items-center gap-1.5 uppercase text-[10px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Cross-Departmental Inconsistency Detected
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {parcel.inconsistencies[0]}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-paper-light dark:bg-night-card border border-hairline space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">
                    Primary Khatedar (Current Legal Title Holder)
                  </div>
                  <div className="text-sm font-serif font-bold text-ink dark:text-paper">
                    {parcel.owners[0]?.name} ({parcel.owners[0]?.hindiName})
                  </div>
                  <div className="text-ink-muted">
                    s/o {parcel.owners[0]?.fatherName} • Share: {parcel.owners[0]?.sharePct}% • {parcel.owners[0]?.tenureType}
                  </div>
                  <div className="text-ink-faint text-[10px]">
                    Mutation: {parcel.owners[0]?.mutationNumber} dated {parcel.owners[0]?.mutationDate}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: OWNERSHIP (RoR) */}
            {activeTab === "ownership" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Jamabandi Record of Rights (Board of Revenue)
                  </span>
                  <span className="text-ink-muted text-[10px]">Khata No: 412/9</span>
                </div>

                {parcel.owners.map((owner, idx) => (
                  <div key={idx} className="p-3.5 border border-hairline bg-paper-light dark:bg-night-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-ink dark:text-paper">
                        {owner.name}
                      </span>
                      <span className="px-2 py-0.5 bg-forest-faint text-forest font-bold text-[10px]">
                        Share: {owner.sharePct}%
                      </span>
                    </div>
                    <div className="text-ink-muted">
                      Hindi Name: <strong className="text-ink dark:text-paper font-hindi">{owner.hindiName}</strong>
                    </div>
                    <div className="text-ink-muted">
                      Father / Husband: {owner.fatherName}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-hairline text-[11px]">
                      <div><span className="text-ink-muted">Aadhaar (Masked):</span> {owner.aadharMasked}</div>
                      <div><span className="text-ink-muted">Phone:</span> {owner.phoneMasked}</div>
                      <div><span className="text-ink-muted">Mutation No:</span> {owner.mutationNumber}</div>
                      <div><span className="text-ink-muted">Sanction Date:</span> {owner.mutationDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: REGISTRATION (Deeds) */}
            {activeTab === "registration" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Sub-Registrar Office Registry Record
                  </span>
                  <span className="text-ink-muted text-[10px]">Book No. 1</span>
                </div>

                <div className="p-3.5 border border-hairline bg-paper-light dark:bg-night-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-ink dark:text-paper">
                      Deed No: {parcel.latestDeed.deedNo}
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      Reg Date: {parcel.latestDeed.regDate}
                    </span>
                  </div>
                  <div className="text-ink-muted">
                    Sub-Registrar Office: <strong className="text-ink dark:text-paper">{parcel.latestDeed.sro}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline">
                    <div>
                      <div className="text-ink-muted text-[10px]">Seller (Vendor):</div>
                      <div className="font-semibold">{parcel.latestDeed.sellerName}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Buyer (Vendee):</div>
                      <div className="font-semibold text-forest">{parcel.latestDeed.buyerName}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Declared Consideration:</div>
                      <div className="font-bold">₹{parcel.latestDeed.declaredValue.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Stamp Duty Paid:</div>
                      <div className="font-bold">₹{parcel.latestDeed.stampDutyPaid.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ENCUMBRANCE & MORTGAGES */}
            {activeTab === "encumbrance" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    CERSAI & Sub-Registrar Encumbrance Certificate
                  </span>
                  <span className="text-ink-muted text-[10px]">Form 15 & 16</span>
                </div>

                {parcel.encumbrances.length === 0 ? (
                  <div className="p-5 border border-hairline bg-paper-light dark:bg-night-card text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 mx-auto text-forest" />
                    <div className="font-bold text-sm text-forest">Nil Encumbrance Certificate</div>
                    <p className="text-ink-muted text-[11px]">
                      No active mortgages, court attachments, or bank liens reported across CERSAI or SRO registers for the last 30 years.
                    </p>
                  </div>
                ) : (
                  parcel.encumbrances.map((enc) => (
                    <div key={enc.id} className="p-3.5 border border-surveyRed/40 bg-surveyRed-faint space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-surveyRed text-sm">
                          {enc.bankName}
                        </span>
                        <span className="px-2 py-0.5 bg-surveyRed text-paper text-[10px] font-bold">
                          {enc.status}
                        </span>
                      </div>
                      <div className="text-ink dark:text-paper">
                        Mortgage Type: {enc.mortgageType}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surveyRed/30">
                        <div>
                          <span className="text-ink-muted">Loan Amount: </span>
                          <strong className="text-surveyRed">₹{enc.loanAmount.toLocaleString("en-IN")}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted">CERSAI Reg: </span>
                          <span>{enc.cersaiRegNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: ZONING & PERMITS */}
            {activeTab === "zoning" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Jaipur Development Authority (Master Plan 2025)
                  </span>
                  <span className="text-ink-muted text-[10px]">Zoning Code: {parcel.zoning.masterPlanCode}</span>
                </div>

                <div className="p-3.5 border border-hairline bg-paper-light dark:bg-night-card space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-ink-muted text-[10px]">Zone Classification:</div>
                      <div className="font-bold text-sm text-ink dark:text-paper">{parcel.zoning.zoneType}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Building Height Limit:</div>
                      <div className="font-bold text-sm text-ink dark:text-paper">{parcel.zoning.maxFloors} Floors (G+{parcel.zoning.maxFloors - 1})</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Maximum Permissible FAR:</div>
                      <div className="font-bold">{parcel.zoning.maxFAR}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Building Permit Status:</div>
                      <div className={`font-bold ${parcel.zoning.permitStatus === "Approved" ? "text-forest" : parcel.zoning.permitStatus === "Unauthorized" ? "text-surveyRed" : "text-ink-muted"}`}>
                        {parcel.zoning.permitStatus} {parcel.zoning.buildingPermitNo ? `(${parcel.zoning.buildingPermitNo})` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TAX & DUES */}
            {activeTab === "tax" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Jaipur Municipal Corporation Property Tax
                  </span>
                  <span className="text-ink-muted text-[10px]">Assessment Year: {parcel.tax.assessmentYear}</span>
                </div>

                <div className="p-3.5 border border-hairline bg-paper-light dark:bg-night-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-ink-muted text-[10px]">Tax Assessment ID:</div>
                      <div className="font-bold text-sm">{parcel.tax.taxId}</div>
                    </div>
                    <span className={`px-2 py-0.5 font-bold text-[10px] ${
                      parcel.tax.paymentStatus === "Paid"
                        ? "bg-forest text-paper"
                        : "bg-surveyRed text-paper"
                    }`}>
                      {parcel.tax.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline">
                    <div>
                      <div className="text-ink-muted text-[10px]">Annual Assessment:</div>
                      <div className="font-bold">₹{parcel.tax.annualDemand.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Outstanding Arrears:</div>
                      <div className={`font-bold ${parcel.tax.totalDue > 0 ? "text-surveyRed" : "text-forest"}`}>
                        ₹{parcel.tax.totalDue.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Last Payment Date:</div>
                      <div>{parcel.tax.lastPaidDate || "None"}</div>
                    </div>
                    <div>
                      <div className="text-ink-muted text-[10px]">Circle Rate Valuation:</div>
                      <div className="font-bold">₹{parcel.circleRatePerSqM.toLocaleString("en-IN")} / m²</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: UTILITIES */}
            {activeTab === "utilities" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Piped Utilities & Hazard Overlay
                  </span>
                  <span className="text-ink-muted text-[10px]">JVVNL & PHED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-hairline bg-paper-light dark:bg-night-card space-y-1">
                    <div className="text-[10px] text-ink-muted uppercase font-bold">Electricity (JVVNL)</div>
                    <div className="font-bold text-sm">{parcel.utilities.electricityId}</div>
                    <div className="text-ink-light">Consumer: {parcel.utilities.electricityConsumer}</div>
                  </div>

                  <div className="p-3 border border-hairline bg-paper-light dark:bg-night-card space-y-1">
                    <div className="text-[10px] text-ink-muted uppercase font-bold">Water Supply (PHED)</div>
                    <div className="font-bold text-sm">{parcel.utilities.waterId}</div>
                    <div className="text-ink-light">Consumer: {parcel.utilities.waterConsumer}</div>
                  </div>
                </div>

                {parcel.floodZoneIntersect && (
                  <div className="p-3.5 bg-surveyRed-faint border border-surveyRed/40 text-surveyRed space-y-1">
                    <div className="font-bold uppercase text-[10px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Flood Hazard Setback Warning
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Parcel intersects with the 100-year High Flood Level (HFL) setback of Dravyavati River. Construction is legally prohibited under NGT directions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TIMELINE */}
            {activeTab === "timeline" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Cross-Departmental Provenance Line
                  </span>
                  <span className="text-ink-muted text-[10px]">Unified History</span>
                </div>

                <div className="space-y-3 relative pl-4 border-l-2 border-forest/40">
                  {parcel.historyTimeline.map((item, idx) => (
                    <div key={idx} className="relative space-y-1">
                      {/* Timeline point dot */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-forest border-2 border-paper dark:border-night" />
                      
                      <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                        <span className="font-bold text-ink dark:text-paper">{item.date}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 bg-forest-faint text-forest font-bold uppercase">
                          {item.department}
                        </span>
                      </div>
                      <p className="text-xs text-ink dark:text-paper font-sans font-medium">
                        {lang === "hi" ? item.eventHi : item.event}
                      </p>
                      <div className="text-[10px] text-ink-muted">
                        Officer: {item.actor} {item.docRef ? `(Ref: ${item.docRef})` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DOCUMENTS & VAULT */}
            {activeTab === "documents" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                    Tamper-Evident Digitized Vault
                  </span>
                  <span className="text-ink-muted text-[10px]">Supabase Storage / Local</span>
                </div>

                {[
                  { name: `Jamabandi_RoR_Khasra_${parcel.khasraNo}.pdf`, type: "Revenue RoR", date: "2024-03-28", size: "1.4 MB" },
                  { name: `Sale_Deed_${parcel.latestDeed.deedNo}.pdf`, type: "Registered Deed", date: parcel.latestDeed.regDate, size: "3.8 MB" },
                  { name: `Cadastral_Demarcation_ETS_${parcel.surveyNo}.geojson`, type: "Survey Geometry", date: "2023-11-09", size: "48 KB" },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 border border-hairline bg-paper-light dark:bg-night-card flex items-center justify-between">
                    <div>
                      <div className="font-bold text-ink dark:text-paper">{doc.name}</div>
                      <div className="text-[10px] text-ink-muted">
                        {doc.type} • Uploaded {doc.date} • {doc.size}
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Simulated Vault: ${doc.name} download verified against SHA-256 ledger checksum.`)}
                      className="p-1.5 border border-hairline hover:border-forest text-forest hover:bg-forest hover:text-paper transition-colors"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Signature 3D Layer Stack Modal */}
      <LayerStack3DModal
        parcel={parcel}
        isOpen={layerModalOpen}
        onClose={() => setLayerModalOpen(false)}
      />

    </div>
  );
}
