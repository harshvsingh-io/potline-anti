"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Send,
  Eye,
  Building,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { dbStore, ServiceRequest } from "@/lib/dbStore";
import { useApp } from "@/components/providers/AppProvider";

const MONTHLY_DATA = [
  { month: "Apr", deeds: 42, mutations: 38, conflicts: 12 },
  { month: "May", deeds: 56, mutations: 50, conflicts: 15 },
  { month: "Jun", deeds: 61, mutations: 58, conflicts: 9 },
  { month: "Jul", deeds: 48, mutations: 44, conflicts: 8 },
  { month: "Aug", deeds: 73, mutations: 69, conflicts: 14 },
  { month: "Sep", deeds: 88, mutations: 82, conflicts: 10 },
];

const RESOLUTION_PIE = [
  { name: "Resolved / Approved", value: 341, color: "#1F4D3A" },
  { name: "Under Field Inspection", value: 68, color: "#C9922E" },
  { name: "Pending Triage", value: 24, color: "#B3372A" },
];

export default function OfficerDashboardPage() {
  const { role, lang } = useApp();
  const [requests, setRequests] = useState<ServiceRequest[]>(dbStore.getServiceRequests());
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);
  const [remarks, setRemarks] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const handleUpdateStatus = (id: string, status: ServiceRequest["status"]) => {
    dbStore.updateServiceRequestStatus(id, status, remarks || "Processed per official protocol");
    setRequests([...dbStore.getServiceRequests()]);
    setSelectedReq(null);
    setRemarks("");
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType === "all") return true;
    return r.status.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Authorized Officer Workspace
            </span>
            <span className="font-mono text-xs text-ink-muted">
              Role: <strong className="text-forest uppercase">{role}</strong>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "राजस्व अधिकारी कार्य-पटल" : "Revenue & Registration Officer Desk"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Review pending mutation deeds, execute field inspection sign-offs, and monitor district throughput velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/audit-trail"
            className="px-3.5 py-2 border border-hairline bg-paper-light dark:bg-night-card font-mono text-xs text-ink dark:text-paper hover:border-forest"
          >
            Audit Log →
          </Link>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monthly Transactions Velocity Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-paper-light dark:bg-night-card border border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold">
                Throughput Analytics
              </span>
              <h3 className="font-serif text-lg font-bold text-ink dark:text-paper">
                Monthly Registered Deeds vs RoR Mutations
              </h3>
            </div>
            <span className="font-mono text-xs text-forest font-bold">
              93.2% Auto-Conversion Rate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,38,33,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "monospace" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F4EFE6",
                    border: "1px solid rgba(27,38,33,0.2)",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="deeds" name="Registered Deeds" fill="#3C6E8F" />
                <Bar dataKey="mutations" name="RoR Mutations Sanctioned" fill="#1F4D3A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Resolution Status Pie (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-paper-light dark:bg-night-card border border-hairline space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold">
              Queue Triage Ratio
            </span>
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper">
              Dispute & Application Clearance
            </h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RESOLUTION_PIE}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {RESOLUTION_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F4EFE6",
                    border: "1px solid rgba(27,38,33,0.2)",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {RESOLUTION_PIE.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-ink dark:text-paper">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Pending Applications Work Queue Table */}
      <div className="border border-hairline bg-paper dark:bg-night-surface space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-ink dark:text-paper">
              Officer Action Queue ({filteredRequests.length} Pending Tasks)
            </h3>
            <div className="font-mono text-xs text-ink-muted">
              Click &lsquo;Review Application&rsquo; to endorse Jamabandi mutation or flag discrepancy
            </div>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <Filter className="w-3.5 h-3.5 text-ink-muted" />
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 border border-hairline ${filterType === "all" ? "bg-forest text-paper font-bold" : "text-ink-muted"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("pending")}
              className={`px-2.5 py-1 border border-hairline ${filterType === "pending" ? "bg-ochre text-paper font-bold" : "text-ink-muted"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterType("approved")}
              className={`px-2.5 py-1 border border-hairline ${filterType === "approved" ? "bg-forest text-paper font-bold" : "text-ink-muted"}`}
            >
              Approved
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-paper-light dark:bg-night-card border-b border-hairline text-ink-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Service Type</th>
                <th className="p-3">Target Parcel (ULPIN)</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-paper-light dark:hover:bg-night-card">
                  <td className="p-3 font-bold text-forest">{req.id}</td>
                  <td className="p-3">{req.serviceType}</td>
                  <td className="p-3">
                    <Link href={`/parcel/${req.ulpin}`} className="text-forest hover:underline font-bold">
                      {req.ulpin}
                    </Link>
                  </td>
                  <td className="p-3">{req.applicantName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      req.status === "Approved"
                        ? "bg-forest-faint text-forest border border-forest/30"
                        : req.status === "Rejected"
                        ? "bg-surveyRed-faint text-surveyRed border border-surveyRed/30"
                        : "bg-ochre-faint text-ochre border border-ochre/30"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedReq(req);
                        setRemarks(req.remarks);
                      }}
                      className="px-2.5 py-1 border border-hairline bg-paper dark:bg-night-card hover:border-forest text-ink dark:text-paper font-mono text-[11px]"
                    >
                      Process →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Endorsement Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-paper dark:bg-night-surface border border-hairline max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div>
                <span className="text-[10px] font-mono text-forest uppercase font-bold">
                  Statutory Officer Action
                </span>
                <h3 className="font-serif text-xl font-bold text-ink dark:text-paper">
                  Process {selectedReq.serviceType}
                </h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-ink-muted hover:text-ink font-mono text-xs">
                ✕
              </button>
            </div>

            <div className="p-3 bg-paper-light dark:bg-night-card border border-hairline font-mono text-xs space-y-1">
              <div><span className="text-ink-muted">Application Ref:</span> {selectedReq.id}</div>
              <div><span className="text-ink-muted">Applicant:</span> {selectedReq.applicantName} ({selectedReq.applicantPhone})</div>
              <div><span className="text-ink-muted">Target Parcel:</span> {selectedReq.ulpin}</div>
              <div><span className="text-ink-muted">Document:</span> {selectedReq.documentName || "None"}</div>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <label className="text-ink-muted uppercase font-bold text-[10px]">
                Officer Endorsement Remarks:
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter field inspection notes or statutory reasons..."
                rows={3}
                className="w-full p-2.5 border border-hairline bg-paper dark:bg-night-card text-ink dark:text-paper text-xs font-mono focus:outline-none focus:border-forest"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-hairline font-mono text-xs">
              <button
                onClick={() => handleUpdateStatus(selectedReq.id, "Rejected")}
                className="px-3.5 py-2 bg-surveyRed text-paper font-semibold hover:bg-surveyRed-hover uppercase"
              >
                Reject / Flag
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReq.id, "Under Field Inspection")}
                className="px-3.5 py-2 bg-ochre text-paper font-semibold hover:bg-ochre-hover uppercase"
              >
                Send for Inspection
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReq.id, "Approved")}
                className="px-4 py-2 bg-forest text-paper font-bold hover:bg-forest-hover uppercase"
              >
                Approve & Sanction
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
