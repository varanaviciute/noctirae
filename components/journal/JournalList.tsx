"use client";

import { useState } from "react";
import { Dream } from "@/types";
import { DreamCard } from "./DreamCard";
import { JournalFilter } from "./JournalFilter";
import { useT } from "@/components/layout/LocaleProvider";

export function JournalList({ dreams }: { dreams: Dream[] }) {
  const t = useT();
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const filtered = dreams.filter((d) => {
    const date = new Date(d.created_at);
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });

  return (
    <>
      {dreams.length > 0 && (
        <JournalFilter onChange={(f, t2) => { setFrom(f); setTo(t2); }} />
      )}

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="text-6xl mb-4">🌙</div>
          <h2 className="text-xl font-semibold text-dream-300 mb-2">
            {dreams.length === 0 ? t.journal.empty.noDreams : t.journal.empty.noDreamsInPeriod}
          </h2>
          <p className="text-dream-500 text-sm max-w-xs">
            {dreams.length === 0
              ? t.journal.empty.noDreamsHint
              : t.journal.empty.noDreamsPeriodHint}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {filtered.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      )}
    </>
  );
}
