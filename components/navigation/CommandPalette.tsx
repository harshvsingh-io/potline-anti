"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShieldAlert, GitBranch, Calculator, Layers, FileText, Activity } from "lucide-react";
import { PARCELS_DATA } from "@/data/parcels";
import { useApp } from "../providers/AppProvider";

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { lang, t } = useApp();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Listen for custom open event (e.g. mobile button or header search button)
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-paper dark:bg-night-surface border border-hairline shadow-2xl overflow-hidden rounded-sm">
        <Command
          label="Global Search"
          className="w-full flex flex-col"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="flex items-center px-4 py-3 border-b border-hairline bg-paper-light dark:bg-night-card">
            <Search className="w-4 h-4 text-ink-muted mr-3 shrink-0" />
            <Command.Input
              placeholder={t.searchPlaceholder}
              autoFocus
              className="w-full bg-transparent text-sm text-ink dark:text-paper placeholder-ink-faint focus:outline-none font-mono"
            />
            <span className="text-[10px] font-mono uppercase bg-paper-dark dark:bg-night-border px-1.5 py-0.5 text-ink-muted">
              ESC
            </span>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="p-4 text-center text-xs text-ink-muted font-mono">
              {lang === "hi" ? "कोई परिणाम नहीं मिला।" : "No matching records found."}
            </Command.Empty>

            {/* Direct Features Section */}
            <Command.Group
              heading={lang === "hi" ? "त्वरित सुविधाएं" : "Core Tools & Modules"}
              className="text-[10px] font-mono uppercase tracking-wider text-ink-muted px-2 py-1.5"
            >
              <Command.Item
                onSelect={() => navigateTo("/conflict-radar")}
                className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper rounded-none"
              >
                <ShieldAlert className="w-4 h-4 text-surveyRed" />
                <span className="font-medium">{t.navConflictRadar}</span>
                <span className="ml-auto text-[10px] font-mono text-ink-muted">Cross-layer Turf validation</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/domino")}
                className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper rounded-none"
              >
                <Activity className="w-4 h-4 text-forest" />
                <span className="font-medium">{t.navDomino}</span>
                <span className="ml-auto text-[10px] font-mono text-ink-muted">Multi-dept sale chain</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/subdivision")}
                className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper rounded-none"
              >
                <GitBranch className="w-4 h-4 text-ochre" />
                <span className="font-medium">{t.navSubdivision}</span>
                <span className="ml-auto text-[10px] font-mono text-ink-muted">2D & 3D boundary split</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/calculator")}
                className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper rounded-none"
              >
                <Calculator className="w-4 h-4 text-slate" />
                <span className="font-medium">{t.navCalculator}</span>
                <span className="ml-auto text-[10px] font-mono text-ink-muted">Circle rate valuation</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/land-pulse")}
                className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper rounded-none"
              >
                <Layers className="w-4 h-4 text-forest" />
                <span className="font-medium">{t.navLandPulse}</span>
                <span className="ml-auto text-[10px] font-mono text-ink-muted">State Admin choropleth</span>
              </Command.Item>
            </Command.Group>

            {/* Parcels Group */}
            <Command.Group
              heading={lang === "hi" ? "पायलट भूखंड (ULPIN)" : "Pilot Land Parcels (Jaipur)"}
              className="text-[10px] font-mono uppercase tracking-wider text-ink-muted px-2 py-1.5 mt-2"
            >
              {PARCELS_DATA.slice(0, 15).map((parcel) => (
                <Command.Item
                  key={parcel.ulpin}
                  value={`${parcel.ulpin} ${parcel.khasraNo} ${parcel.owners[0]?.name} ${parcel.village}`}
                  onSelect={() => navigateTo(`/parcel/${parcel.ulpin}`)}
                  className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                >
                  <MapPin className="w-3.5 h-3.5 text-forest shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold text-ink dark:text-paper">
                      {parcel.ulpin}
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {parcel.khasraNo} • {parcel.owners[0]?.name} • {parcel.village}
                    </span>
                  </div>
                  {parcel.inconsistencies.length > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono bg-surveyRed-faint text-surveyRed border border-surveyRed/30 uppercase">
                      Anomaly
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="p-2 border-t border-hairline bg-paper-light dark:bg-night-card flex items-center justify-between text-[10px] font-mono text-ink-muted">
            <span>Navigation: ↑ ↓ Enter</span>
            <span>Close: ESC</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
