"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  Copy,
  Check,
  Key,
  Layers,
  ShieldCheck,
  Code2,
  RefreshCw,
} from "lucide-react";
import { PARCELS_DATA } from "@/data/parcels";
import { useApp } from "@/components/providers/AppProvider";

interface EndpointDoc {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  sampleUlpin: string;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/api/parcels/{ulpin}",
    title: "Fetch Unified Parcel 360 Record",
    description: "Returns base cadastral polygon, area, elevation, coordinates, and Land Stack tier metadata.",
    sampleUlpin: "RJ08040001001A",
  },
  {
    method: "GET",
    path: "/api/ownership/{ulpin}",
    title: "Fetch Jamabandi RoR & Ownership Succession",
    description: "Returns legal title holders, coparcenary share percentages, and mutation history.",
    sampleUlpin: "RJ08040001001A",
  },
  {
    method: "GET",
    path: "/api/encumbrance/{ulpin}",
    title: "Fetch Bank Mortgages & Liens (CERSAI)",
    description: "Queries active bank charges, loan amounts, and Sub-Registrar encumbrance index entries.",
    sampleUlpin: "RJ08040001003A",
  },
  {
    method: "GET",
    path: "/api/verify/{id}",
    title: "Verify Digital Certificate Authenticity",
    description: "Returns tamper-evident SHA-256 verification status and certificate timestamp.",
    sampleUlpin: "RJ08040001001A",
  },
];

export default function ApiConsolePage() {
  const { lang } = useApp();

  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [paramUlpin, setParamUlpin] = useState("RJ08040001001A");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState("plt_live_7f8a9b2c3d4e5f6a1b2c3d4e5f");
  const [requestCount, setRequestCount] = useState(14);

  const activeDoc = ENDPOINTS[activeEndpointIndex];

  const handleRunQuery = async () => {
    setLoading(true);
    try {
      const url = activeDoc.path.replace("{ulpin}", paramUlpin).replace("{id}", paramUlpin);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setJsonResponse(JSON.stringify(data, null, 2));
      } else {
        // Fallback simulation directly from mock data if needed
        const parcel = PARCELS_DATA.find((p) => p.ulpin === paramUlpin) || PARCELS_DATA[0];
        setJsonResponse(JSON.stringify({ status: "success", data: parcel }, null, 2));
      }
      setRequestCount((c) => Math.min(100, c + 1));
    } catch {
      const parcel = PARCELS_DATA.find((p) => p.ulpin === paramUlpin) || PARCELS_DATA[0];
      setJsonResponse(JSON.stringify({ status: "success", data: parcel }, null, 2));
      setRequestCount((c) => Math.min(100, c + 1));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (jsonResponse) {
      navigator.clipboard.writeText(jsonResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateNewKey = () => {
    const randomKey = "plt_live_" + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setApiKey(randomKey);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase font-bold tracking-wider">
              Open DPI Public API Sandbox
            </span>
            <span className="font-mono text-xs text-ink-muted">
              REST & JSON Over HTTPS
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "ओपन एपीआई कंसोल" : "Open DPI API Explorer & Console"}
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Machine-readable land governance APIs for banks, judiciary, municipal GIS, and authorized fintech integrations.
          </p>
        </div>

        {/* Rate limit status meter */}
        <div className="p-3 bg-paper-light dark:bg-night-card border border-hairline font-mono text-xs space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-muted uppercase text-[10px] font-bold">API Quota:</span>
            <span className="font-bold text-forest">{requestCount} / 100 req / min</span>
          </div>
          <div className="w-36 h-1.5 bg-paper-dark dark:bg-night-surface rounded-none overflow-hidden">
            <div className="h-full bg-forest" style={{ width: `${requestCount}%` }} />
          </div>
        </div>
      </div>

      {/* API Key Management Header Widget */}
      <div className="p-4 bg-paper-light dark:bg-night-card border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-0.5">
          <div className="text-[10px] text-ink-muted uppercase font-bold flex items-center gap-1.5">
            <Key className="w-3 h-3 text-forest" />
            <span>Developer Sandbox Authorization Bearer Token:</span>
          </div>
          <div className="text-ink dark:text-paper font-bold select-all break-all">
            {apiKey}
          </div>
        </div>

        <button
          onClick={generateNewKey}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline bg-paper dark:bg-night-surface hover:border-forest text-ink dark:text-paper transition-colors shrink-0"
        >
          <RefreshCw className="w-3 h-3 text-forest" />
          <span>Rotate Token</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: API Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-3 font-mono text-xs">
          <div className="text-[10px] text-ink-muted uppercase font-bold tracking-wider pb-1 border-b border-hairline">
            Available Endpoints
          </div>

          {ENDPOINTS.map((ep, idx) => {
            const isSelected = idx === activeEndpointIndex;
            return (
              <button
                key={ep.path}
                onClick={() => {
                  setActiveEndpointIndex(idx);
                  setParamUlpin(ep.sampleUlpin);
                  setJsonResponse("");
                }}
                className={`w-full p-3.5 border text-left transition-colors space-y-1 block ${
                  isSelected
                    ? "border-forest bg-forest-faint dark:bg-forest/15 shadow-xs"
                    : "border-hairline bg-paper dark:bg-night-surface hover:border-forest/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 bg-forest text-paper text-[9px] font-bold">
                    {ep.method}
                  </span>
                  <span className="font-bold text-ink dark:text-paper truncate">
                    {ep.path}
                  </span>
                </div>
                <div className="text-[11px] font-sans text-ink-light dark:text-paper/80 font-medium line-clamp-1">
                  {ep.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Live "Try It" Playground & Code Viewer (8 cols) */}
        <div className="lg:col-span-8 space-y-4 font-mono text-xs">
          
          {/* Active Endpoint Info Card */}
          <div className="p-5 bg-paper dark:bg-night-surface border border-hairline space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-bold">
                {activeDoc.method}
              </span>
              <span className="font-bold text-sm text-ink dark:text-paper">
                {activeDoc.path}
              </span>
            </div>
            <p className="text-ink-light dark:text-paper/80 font-sans text-xs leading-relaxed">
              {activeDoc.description}
            </p>

            {/* Input Param */}
            <div className="pt-2 border-t border-hairline flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center border border-hairline bg-paper-light dark:bg-night-card flex-1">
                <span className="px-3 text-ink-muted text-[10px] uppercase font-bold border-r border-hairline">
                  ULPIN Param:
                </span>
                <input
                  type="text"
                  value={paramUlpin}
                  onChange={(e) => setParamUlpin(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-ink dark:text-paper focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunQuery}
                disabled={loading}
                className="px-5 py-2 bg-forest hover:bg-forest-hover text-paper font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{loading ? "Executing..." : "Execute API"}</span>
              </button>
            </div>
          </div>

          {/* Response Code Block */}
          <div className="border border-hairline bg-paper-light dark:bg-night-card">
            <div className="p-3 border-b border-hairline flex items-center justify-between text-[11px] text-ink-muted">
              <span>HTTP 200 OK • Content-Type: application/json</span>
              {jsonResponse && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 hover:text-forest transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
              )}
            </div>

            <div className="p-4 max-h-[380px] overflow-y-auto bg-[#1B2621] text-[#E0EAE4] font-mono text-[11px] leading-relaxed">
              {jsonResponse ? (
                <pre className="whitespace-pre-wrap">{jsonResponse}</pre>
              ) : (
                <div className="text-[#889990] italic">
                  // Click &lsquo;Execute API&rsquo; to send live request and view response payload...
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
