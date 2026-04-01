"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Translations } from "@/locales/en";
import en from "@/locales/en";

const LocaleContext = createContext<Translations>(en);
const LocaleCodeContext = createContext<string>("en");

export function useT() {
  return useContext(LocaleContext);
}

export function useLocale() {
  return useContext(LocaleCodeContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [t, setT] = useState<Translations>(en);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    const cookieLocale = document.cookie.split(";").find((c) => c.trim().startsWith("locale="))?.split("=")[1];
    const lang = saved ?? cookieLocale ?? "en";
    if (!saved && cookieLocale) localStorage.setItem("language", cookieLocale);
    loadLocale(lang);
  }, []);

  async function loadLocale(loc: string) {
    try {
      const mod = await import(`@/locales/${loc}`);
      setT(mod.default);
      setLocale(loc);
    } catch {
      setT(en);
      setLocale("en");
    }
  }

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "language" && e.newValue) loadLocale(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <LocaleCodeContext.Provider value={locale}>
      <LocaleContext.Provider value={t}>{children}</LocaleContext.Provider>
    </LocaleCodeContext.Provider>
  );
}
