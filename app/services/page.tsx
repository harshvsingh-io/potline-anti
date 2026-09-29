"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Send,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { dbStore, ServiceRequest } from "@/lib/dbStore";
import { PARCELS_DATA } from "@/data/parcels";
import { PhoneSimulator } from "@/components/notifications/PhoneSimulator";
import { useApp } from "@/components/providers/AppProvider";

export default function ServicesPage() {
  const { lang } = useApp();
  const [requests, setRequests] = useState<ServiceRequest[]>(dbStore.getServiceRequests());
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State
  const [targetUlpin, setTargetUlpin] = useState("RJ08040001001A");
  const [serviceType, setServiceType] = useState<ServiceRequest["serviceType"]>("Mutation (Namantaran)");
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantAadhar, setApplicantAadhar] = useState("");
  const [remarks, setRemarks] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) {
      alert("Please provide applicant name and phone number.");
      return;
    }

    const newReq = dbStore.createServiceRequest({
      ulpin: targetUlpin,
      serviceType,
      applicantName,
      applicantPhone,
      applicantAadhar: applicantAadhar || "XXXX-XXXX-9988",
      remarks: remarks || "Online citizen application submitted via Land Stack portal.",
      documentName: fileName || "Supporting_Affidavit.pdf",
    });

    setSubmittedId(newReq.id);
    setRequests([...dbStore.getServiceRequests()]);

    // Reset form
    setApplicantName("");
    setApplicantPhone("");
    setApplicantAadhar("");
    setRemarks("");
    setFileName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-hairline pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
            Public Public Infrastructure Citizen Portal
          </span>
          <span className="font-mono text-xs text-ink-muted">
            Direct Government Service Delivery
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
          {lang === "hi" ? "नागरिक सेवाएं एवं आवेदन ट्रैकिंग" : "Citizen Land Services & Vault"}
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-1">
          Apply online for Jamabandi mutation (Namantaran), certified digital copies (Nakal), and official boundary demarcation (Seemagyan).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Application Form & Tracking (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Submission Success Alert */}
          {submittedId && (
            <div className="p-4 bg-forest-faint dark:bg-forest/15 border border-forest text-forest font-mono text-xs space-y-1">
              <div className="font-bold flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Lodged Successfully!</span>
              </div>
              <p>
                Tracking ID: <strong className="text-ink dark:text-paper">{submittedId}</strong>. 
                A simulated WhatsApp confirmation message has been dispatched to the notification simulator.
              </p>
            </div>
          )}

          {/* Service Request Form */}
          <form onSubmit={handleSubmit} className="p-6 bg-paper-light dark:bg-night-card border border-hairline space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                Submit Citizen Application
              </span>
              <span className="text-ink-muted text-[10px]">Direct e-Mitra Integration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ink-muted uppercase text-[10px] font-bold">
                  Select Land Parcel (ULPIN):
                </label>
                <select
                  value={targetUlpin}
                  onChange={(e) => setTargetUlpin(e.target.value)}
                  className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline text-xs"
                >
                  {PARCELS_DATA.slice(0, 15).map((p) => (
                    <option key={p.ulpin} value={p.ulpin}>
                      {p.ulpin} ({p.khasraNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-ink-muted uppercase text-[10px] font-bold">
                  Required Public Service:
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline text-xs"
                >
                  <option value="Mutation (Namantaran)">Mutation Post-Sale (Namantaran)</option>
                  <option value="Certified Copy (Nakal)">Certified Jamabandi RoR (Nakal)</option>
                  <option value="Boundary Demarcation">Boundary Demarcation (Seemagyan)</option>
                  <option value="Dispute Injunction Flag">Dispute / Injunction Caveat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-ink-muted uppercase text-[10px] font-bold">
                  Applicant Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ink-muted uppercase text-[10px] font-bold">
                  Mobile Number (SMS / WhatsApp):
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98290-XXXXX"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full p-2.5 bg-paper dark:bg-night-surface border border-hairline text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-ink-muted uppercase text-[10px] font-bold">
                Supporting Deed / Legal Affidavit (Upload to Vault):
              </label>
              <div className="border border-dashed border-hairline p-3 bg-paper dark:bg-night-surface flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-muted">
                  <Upload className="w-4 h-4 text-forest" />
                  <span>{fileName ? fileName : "Attach PDF / Scanned Copy..."}</span>
                </div>
                <input
                  type="file"
                  id="docUpload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                />
                <label
                  htmlFor="docUpload"
                  className="px-2.5 py-1 border border-hairline bg-paper-light dark:bg-night-card cursor-pointer hover:border-forest"
                >
                  Browse File
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-ink-muted uppercase text-[10px] font-bold">
                Application Remarks / Ground Notes:
              </label>
              <textarea
                placeholder="Specify reason or reference deed numbers..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="w-full p-2 bg-paper dark:bg-night-surface border border-hairline text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest hover:bg-forest-hover text-paper font-mono uppercase tracking-wider font-bold text-xs flex items-center justify-center gap-2 border border-forest transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Application & Generate Tracking ID</span>
            </button>
          </form>

          {/* Active Application Status Tracker */}
          <div className="border border-hairline bg-paper dark:bg-night-surface p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-bold text-forest uppercase tracking-wider text-[11px]">
                Live Status Tracker ({requests.length} Requests)
              </span>
              <span className="text-ink-muted text-[10px]">Real-time State Queue</span>
            </div>

            <div className="divide-y divide-hairline">
              {requests.map((r) => (
                <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-ink dark:text-paper flex items-center gap-2">
                      <span>{r.id}: {r.serviceType}</span>
                      <span className="font-normal text-ink-muted">({r.ulpin})</span>
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Applicant: {r.applicantName} • Assigned: {r.assignedOfficer}
                    </div>
                    <div className="text-[10px] text-ink-faint">
                      Remarks: {r.remarks}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase self-start sm:self-center ${
                    r.status === "Approved"
                      ? "bg-forest text-paper"
                      : r.status === "Rejected"
                      ? "bg-surveyRed text-paper"
                      : "bg-ochre text-paper"
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Simulated Phone Notifications (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-forest font-bold block">
              Citizen Notification Preview
            </span>
            <div className="text-xs font-mono text-ink-muted">
              Live automated SMS & WhatsApp notification alerts triggered upon registry actions.
            </div>
          </div>

          <PhoneSimulator />
        </div>

      </div>

    </div>
  );
}
