"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/layout/LocaleProvider";

type Preset = "all" | "today" | "week" | "month" | "custom";

interface Props {
  onChange: (from: Date | null, to: Date | null) => void;
}

export function JournalFilter({ onChange }: Props) {
  const t = useT();
  const [active, setActive] = useState<Preset>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customError, setCustomError] = useState("");

  const PRESETS: { key: Preset; label: string }[] = [
    { key: "all", label: t.journal.filters.all },
    { key: "today", label: t.journal.filters.today },
    { key: "week", label: t.journal.filters.week },
    { key: "month", label: t.journal.filters.month },
    { key: "custom", label: t.journal.filters.custom },
  ];

  function applyPreset(preset: Preset) {
    setActive(preset);
    const now = new Date();
    if (preset === "all") { onChange(null, null); return; }
    if (preset === "today") {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      onChange(start, now); return;
    }
    if (preset === "week") {
      const start = new Date(now); start.setDate(now.getDate() - 7); start.setHours(0, 0, 0, 0);
      onChange(start, now); return;
    }
    if (preset === "month") {
      const start = new Date(now); start.setDate(1); start.setHours(0, 0, 0, 0);
      onChange(start, now); return;
    }
  }

  function applyCustom() {
    if (!from || !to) {
      setCustomError(t.journal.filters.dateError);
      return;
    }
    setCustomError("");
    const f = new Date(from);
    const t2 = new Date(to + "T23:59:59");
    onChange(f, t2);
  }

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
              active === key
                ? "bg-dream-600/30 text-dream-200 border border-dream-600/40"
                : "glass text-dream-500 hover:text-dream-300 border border-dream-800/30"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {active === "custom" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2">
              <Calendar size={14} className="text-dream-500" />
              <input
                type="date"
                value={from}
                onChange={(e) => { setFrom(e.target.value); setCustomError(""); }}
                className="bg-transparent text-dream-300 text-xs focus:outline-none"
              />
            </div>
            <span className="text-dream-600 text-xs">—</span>
            <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2">
              <Calendar size={14} className="text-dream-500" />
              <input
                type="date"
                value={to}
                onChange={(e) => { setTo(e.target.value); setCustomError(""); }}
                className="bg-transparent text-dream-300 text-xs focus:outline-none"
              />
            </div>
            <button
              onClick={applyCustom}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-dream-600/20 text-dream-300 border border-dream-600/30 hover:bg-dream-600/30 transition-all"
            >
              {t.journal.filters.apply}
            </button>
          </div>
          {customError && (
            <p className="text-xs text-red-400">{customError}</p>
          )}
        </div>
      )}
    </div>
  );
}
