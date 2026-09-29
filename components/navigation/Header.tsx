"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Mic,
  Moon,
  Sun,
  UserCheck,
  ChevronDown,
  Layers,
  Menu,
  X,
  ShieldAlert,
  GitBranch,
  Activity,
  Calculator,
  FileCheck2,
  Database,
  Satellite,
  Terminal,
  History,
  BookOpen,
} from "lucide-react";
import { Wordmark } from "../branding/Wordmark";
import { useApp } from "../providers/AppProvider";
import { UserRole } from "@/lib/dbStore";
import { VoiceSearchModal } from "./VoiceSearchModal";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { role, setRole, lang, setLang, t, isDark, toggleDark } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rolesList: { id: UserRole; label: string; badge: string }[] = [
    { id: "citizen", label: t.roleCitizen, badge: "Citizen" },
    { id: "patwari", label: t.rolePatwari, badge: "Revenue / Patwari" },
    { id: "sub_registrar", label: t.roleSubRegistrar, badge: "Sub-Registrar" },
    { id: "urban_planner", label: t.rolePlanner, badge: "Urban Planning" },
    { id: "state_admin", label: t.roleAdmin, badge: "State Admin" },
  ];

  const currentRoleObj = rolesList.find((r) => r.id === role) || rolesList[0];

  const triggerCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/95 dark:bg-night/95 backdrop-blur-xs border-b border-hairline transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-95 transition-opacity">
              <Wordmark size="md" />
            </Link>

            {/* Main Nav Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-ink-light dark:text-paper/80">
              <Link
                href="/parcel/RJ08040001001A"
                className={`px-3 py-1.5 border border-transparent hover:border-hairline transition-colors ${
                  pathname.startsWith("/parcel") ? "border-hairline bg-paper-light dark:bg-night-card text-forest font-semibold" : ""
                }`}
              >
                {t.navExplore}
              </Link>

              <Link
                href="/dashboard"
                className={`px-3 py-1.5 border border-transparent hover:border-hairline transition-colors ${
                  pathname === "/dashboard" ? "border-hairline bg-paper-light dark:bg-night-card text-forest font-semibold" : ""
                }`}
              >
                {t.navDashboard}
              </Link>

              <Link
                href="/conflict-radar"
                className={`px-3 py-1.5 border border-transparent hover:border-hairline transition-colors flex items-center gap-1.5 ${
                  pathname === "/conflict-radar" ? "border-hairline bg-paper-light dark:bg-night-card text-surveyRed font-semibold" : ""
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-surveyRed" />
                <span>{t.navConflictRadar}</span>
              </Link>

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                  className="px-3 py-1.5 border border-transparent hover:border-hairline flex items-center gap-1 transition-colors"
                >
                  <span>Tools & DPI</span>
                  <ChevronDown className="w-3 h-3 text-ink-muted" />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-paper dark:bg-night-surface border border-hairline shadow-lg p-1.5 z-50 rounded-none">
                    <Link
                      href="/domino"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <Activity className="w-3.5 h-3.5 text-forest" />
                      <span>{t.navDomino}</span>
                    </Link>
                    <Link
                      href="/subdivision"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-ochre" />
                      <span>{t.navSubdivision}</span>
                    </Link>
                    <Link
                      href="/calculator"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <Calculator className="w-3.5 h-3.5 text-slate" />
                      <span>{t.navCalculator}</span>
                    </Link>
                    <Link
                      href="/services"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-forest" />
                      <span>{t.navServices}</span>
                    </Link>
                    <Link
                      href="/land-pulse"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <Layers className="w-3.5 h-3.5 text-forest" />
                      <span>{t.navLandPulse}</span>
                    </Link>
                    <Link
                      href="/schema-mapper"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <Database className="w-3.5 h-3.5 text-ink-muted" />
                      <span>{t.navSchemaMapper}</span>
                    </Link>
                    <Link
                      href="/change-detection"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <Satellite className="w-3.5 h-3.5 text-surveyRed" />
                      <span>{t.navChangeDetection}</span>
                    </Link>
                    <div className="h-[1px] bg-ink/10 dark:bg-paper/10 my-1" />
                    <Link
                      href="/api-console"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <Terminal className="w-3.5 h-3.5 text-ink-muted" />
                      <span>{t.navApiConsole}</span>
                    </Link>
                    <Link
                      href="/audit-trail"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <History className="w-3.5 h-3.5 text-ink-muted" />
                      <span>{t.navAuditTrail}</span>
                    </Link>
                    <Link
                      href="/standards"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-forest/10 dark:hover:bg-forest/20 text-ink dark:text-paper"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-forest" />
                      <span>{t.navStandards}</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button (Ctrl+K) */}
            <button
              onClick={triggerCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-paper-light dark:bg-night-card border border-hairline text-ink-muted hover:text-ink dark:hover:text-paper text-xs font-mono transition-colors"
              title="Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-forest" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline text-[9px] uppercase px-1 py-0.2 bg-paper dark:bg-night border border-hairline">
                Ctrl K
              </kbd>
            </button>

            {/* Voice Search Trigger */}
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="p-1.5 text-ink-muted hover:text-forest dark:hover:text-paper border border-hairline transition-colors bg-paper-light dark:bg-night-card"
              title={t.searchByVoice}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* English / Hindi Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="px-2 py-1 border border-hairline font-mono text-[11px] font-bold text-ink dark:text-paper hover:bg-paper-light dark:hover:bg-night-card transition-colors"
              title="Toggle English / Hindi"
            >
              {lang === "en" ? "हिन्दी" : "EN"}
            </button>

            {/* Dark Mode Night Survey Toggle */}
            <button
              onClick={toggleDark}
              className="p-1.5 border border-hairline text-ink-muted hover:text-ink dark:hover:text-paper transition-colors bg-paper-light dark:bg-night-card"
              title="Toggle Night Survey Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-forest/40 bg-forest-faint dark:bg-forest/15 text-forest dark:text-[#56b08d] text-xs font-mono font-medium hover:border-forest transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline truncate max-w-[130px]">{currentRoleObj.badge}</span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-paper dark:bg-night-surface border border-hairline shadow-xl p-1 z-50">
                  <div className="px-3 py-1.5 border-b border-hairline text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    {t.switchRole}
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between font-mono hover:bg-forest/10 dark:hover:bg-forest/20 ${
                        role === r.id ? "bg-forest/10 dark:bg-forest/20 font-bold text-forest" : "text-ink dark:text-paper"
                      }`}
                    >
                      <span>{r.label}</span>
                      {role === r.id && <span className="text-[10px] text-forest">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 border border-hairline text-ink dark:text-paper"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Slide-down */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-hairline bg-paper-light dark:bg-night-card p-4 space-y-2 text-xs font-mono uppercase">
            <Link
              href="/parcel/RJ08040001001A"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navExplore}
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navDashboard}
            </Link>
            <Link
              href="/conflict-radar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline text-surveyRed"
            >
              {t.navConflictRadar}
            </Link>
            <Link
              href="/domino"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navDomino}
            </Link>
            <Link
              href="/subdivision"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navSubdivision}
            </Link>
            <Link
              href="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navCalculator}
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navServices}
            </Link>
            <Link
              href="/land-pulse"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-hairline"
            >
              {t.navLandPulse}
            </Link>
            <Link
              href="/api-console"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2"
            >
              {t.navApiConsole}
            </Link>
          </div>
        )}
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </>
  );
};
