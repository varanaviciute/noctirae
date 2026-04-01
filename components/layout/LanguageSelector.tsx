"use client";

import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/layout/LocaleProvider";

const LANGUAGES = [
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "lt", label: "Lietuvių",   flag: "🇱🇹" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "pt", label: "Português",  flag: "🇵🇹" },
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "pl", label: "Polski",     flag: "🇵🇱" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "zh", label: "中文",        flag: "🇨🇳" },
  { code: "ja", label: "日本語",      flag: "🇯🇵" },
];

export function LanguageSelector() {
  const t = useT();
  const [selected, setSelected] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelected(localStorage.getItem("language") || "en");
  }, []);

  async function select(code: string) {
    setSelected(code);
    localStorage.setItem("language", code);
    document.cookie = `locale=${code};path=/;max-age=31536000`;
    // Reload locale in provider
    const event = new StorageEvent("storage", { key: "language", newValue: code });
    window.dispatchEvent(event);
    setOpen(false);
  }

  const current = LANGUAGES.find((l) => l.code === selected)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-dream-900/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <Globe size={18} className="text-dream-400" />
          <span className="text-sm font-medium text-dream-300">{t.settings.language}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dream-400">{current.flag} {current.label}</span>
          <ChevronDown size={16} className={cn("text-dream-600 transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-2 glass-card rounded-2xl overflow-y-auto z-50 border border-dream-800/30 max-h-72 shadow-xl">
            {LANGUAGES.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => select(code)}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-3 text-sm transition-all hover:bg-dream-900/40 text-left",
                  selected === code ? "text-dream-200 bg-dream-800/20" : "text-dream-400"
                )}
              >
                <span>{flag}</span>
                <span>{label}</span>
                {selected === code && <span className="ml-auto text-dream-600 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
