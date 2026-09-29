"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole, dbStore } from "@/lib/dbStore";
import { DICTIONARY, Language, Translations } from "@/lib/i18n";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isDark: boolean;
  toggleDark: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("citizen");
  const [lang, setLangState] = useState<Language>("en");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setRoleState(dbStore.getRole());
    setLangState(dbStore.getLanguage());
    const darkSaved = localStorage.getItem("plotline_dark") === "true";
    setIsDark(darkSaved);
    if (darkSaved) {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    dbStore.setRole(newRole);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    dbStore.setLanguage(newLang);
  };

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("plotline_dark", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("plotline_dark", "false");
      }
      return next;
    });
  };

  const t = DICTIONARY[lang];

  return (
    <AppContext.Provider value={{ role, setRole, lang, setLang, t, isDark, toggleDark }}>
      <div className={lang === "hi" ? "font-hindi" : ""}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
