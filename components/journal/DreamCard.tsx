"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dream } from "@/types";
import { formatDate, truncate } from "@/lib/utils";
import { X, Star, Brain, Sparkles, Trash2 } from "lucide-react";
import { useT, useLocale } from "@/components/layout/LocaleProvider";

interface DreamCardProps {
  dream: Dream;
}

export function DreamCard({ dream }: DreamCardProps) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/mock-delete-dream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dream.id }),
    });
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full glass-card rounded-2xl p-5 text-left transition-all hover:border-dream-700/40"
      >
        <p className="text-xs text-dream-600 mb-1">{formatDate(dream.created_at, locale)}</p>
        <h3 className="font-semibold text-dream-200 text-sm truncate">{dream.title}</h3>

        {dream.symbols && dream.symbols.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {dream.symbols.slice(0, 4).map((symbol) => (
              <span
                key={symbol}
                className="text-xs px-2 py-0.5 rounded-full bg-dream-800/40 border border-dream-700/30 text-dream-400"
              >
                {symbol}
              </span>
            ))}
            {dream.symbols.length > 4 && (
              <span className="text-xs text-dream-600">+{dream.symbols.length - 4}</span>
            )}
          </div>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setOpen(false); setConfirmDelete(false); }} />
          <div className="relative glass-card rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto dream-glow">
            {/* Header */}
            <div className="sticky top-0 glass-card rounded-t-2xl px-6 py-4 border-b border-dream-900/40 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-dream-600 mb-0.5">{formatDate(dream.created_at, locale)}</p>
                <h2 className="font-semibold text-dream-200 text-sm">{dream.title}</h2>
              </div>
              <button onClick={() => { setOpen(false); setConfirmDelete(false); }} className="text-dream-500 hover:text-dream-300 transition-colors flex-shrink-0 mt-0.5">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
              <p className="text-dream-400 text-sm leading-relaxed">{dream.content}</p>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Star size={13} className="text-dream-400" />
                  <span className="text-xs font-semibold text-dream-400 uppercase tracking-wider">{t.journal.card.summary}</span>
                </div>
                <p className="text-dream-300 text-sm italic">"{dream.interpretation.summary}"</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Brain size={13} className="text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{t.journal.card.psychological}</span>
                </div>
                <p className="text-dream-300 text-sm leading-relaxed">{dream.interpretation.psychological}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={13} className="text-purple-400" />
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{t.journal.card.esoteric}</span>
                </div>
                <p className="text-dream-300 text-sm leading-relaxed">{dream.interpretation.esoteric}</p>
              </div>

              {dream.interpretation.symbols?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-dream-500 uppercase tracking-wider mb-2">{t.journal.card.keySymbols}</p>
                  <ul className="space-y-1">
                    {dream.interpretation.symbols.map((s, i) => (
                      <li key={i} className="text-sm text-dream-400">
                        <span className="text-dream-200 font-medium">{s.symbol}</span> — {s.meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dream.interpretation.insights && (
                <div className="p-3 rounded-xl bg-dream-950/60 border border-dream-800/30">
                  <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1">{t.journal.card.patternInsight}</p>
                  <p className="text-dream-300 text-sm">{dream.interpretation.insights}</p>
                </div>
              )}

              {/* Delete */}
              <div className="pt-2 border-t border-dream-900/30">
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 text-xs text-dream-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} /> {t.journal.card.deleteEntry}
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-dream-400">{t.journal.card.deleteConfirm}</p>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                    >
                      {deleting ? t.journal.card.deleting : t.journal.card.deleteYes}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs text-dream-500 hover:text-dream-300 transition-colors"
                    >
                      {t.journal.card.cancel}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
