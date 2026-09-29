"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  ShieldCheck,
  Filter,
  Search,
  Hash,
  Download,
  Clock,
  UserCheck,
} from "lucide-react";
import { dbStore, AuditLogEntry, UserRole } from "@/lib/dbStore";
import { useApp } from "@/components/providers/AppProvider";

export default function AuditTrailPage() {
  const { lang } = useApp();
  const [logs, setLogs] = useState<AuditLogEntry[]>(dbStore.getAuditLogs());
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter((log) => {
    if (filterRole !== "all" && log.role !== filterRole) return false;
    if (filterAction !== "all" && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.parcelUlpin.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAuditCSV = () => {
    const headers = ["ID", "Timestamp", "Actor", "Role", "Action", "Parcel", "Department", "IP", "SHA256"];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.role,
      l.action,
      l.parcelUlpin,
      `"${l.department}"`,
      l.ipAddress,
      l.hash,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Plotline_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Immutable Cadastral Ledger
            </span>
            <span className="font-mono text-xs text-ink-muted">
              Section 65B Indian Evidence Act Compliant
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "अपरिवर्तनीय ऑडिट ट्रेल" : "Immutable Audit Trail & Activity Ledger"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Cryptographically sealed provenance of every record mutation, deed registration, conflict resolution, and citizen service application.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-hairline bg-paper-light dark:bg-night-card font-mono text-xs text-ink dark:text-paper hover:border-forest transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-forest" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted uppercase text-[10px] font-bold">Role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-1.5 border border-hairline bg-paper dark:bg-night-surface text-ink dark:text-paper"
            >
              <option value="all">All Roles</option>
              <option value="citizen">Citizen</option>
              <option value="patwari">Patwari / Revenue</option>
              <option value="sub_registrar">Sub-Registrar</option>
              <option value="urban_planner">Urban Planner</option>
              <option value="state_admin">State Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted uppercase text-[10px] font-bold">Action Category:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="p-1.5 border border-hairline bg-paper dark:bg-night-surface text-ink dark:text-paper"
            >
              <option value="all">All Events</option>
              <option value="verification">Verification</option>
              <option value="registration">Registration</option>
              <option value="conflict">Conflict Resolution</option>
              <option value="domino">Domino Chain</option>
              <option value="service">Service Request</option>
            </select>
          </div>
        </div>

        <div className="flex items-center border border-hairline bg-paper dark:bg-night-surface px-2.5 py-1">
          <Search className="w-3.5 h-3.5 text-ink-muted mr-2" />
          <input
            type="text"
            placeholder="Search actor, ULPIN, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-ink dark:text-paper focus:outline-none w-52"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-hairline bg-paper dark:bg-night-surface overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-paper-light dark:bg-night-card border-b border-hairline uppercase tracking-wider text-[10px] text-ink-muted">
            <tr>
              <th className="p-3">Log ID & Time</th>
              <th className="p-3">Actor & Role</th>
              <th className="p-3">Target Parcel</th>
              <th className="p-3">Department</th>
              <th className="p-3">Event Action & Remarks</th>
              <th className="p-3">Audit Hash (SHA-256)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-paper-light dark:hover:bg-night-card transition-colors">
                <td className="p-3 align-top whitespace-nowrap">
                  <div className="font-bold text-forest">{log.id}</div>
                  <div className="text-[10px] text-ink-muted mt-0.5">{log.timestamp}</div>
                </td>
                <td className="p-3 align-top whitespace-nowrap">
                  <div className="font-bold text-ink dark:text-paper">{log.actor}</div>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase bg-paper-dark dark:bg-night-border text-ink-muted">
                    {log.role}
                  </span>
                </td>
                <td className="p-3 align-top whitespace-nowrap">
                  {log.parcelUlpin === "ALL_PARCELS" ? (
                    <span className="text-ink-muted font-bold">State Batch</span>
                  ) : (
                    <Link href={`/parcel/${log.parcelUlpin}`} className="text-forest hover:underline font-bold">
                      {log.parcelUlpin}
                    </Link>
                  )}
                </td>
                <td className="p-3 align-top text-ink-light dark:text-paper/80 whitespace-nowrap">
                  {log.department}
                </td>
                <td className="p-3 align-top max-w-md">
                  <div className="font-bold text-ink dark:text-paper text-[11px]">{log.action}</div>
                  <div className="text-ink-muted text-[11px] leading-relaxed mt-0.5">{log.details}</div>
                  <div className="text-[9px] text-ink-faint mt-1">IP: {log.ipAddress}</div>
                </td>
                <td className="p-3 align-top">
                  <div className="p-1 bg-paper-light dark:bg-night-card border border-hairline text-[9px] font-mono text-ink-muted select-all break-all max-w-[140px]">
                    {log.hash.slice(0, 16)}...
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
