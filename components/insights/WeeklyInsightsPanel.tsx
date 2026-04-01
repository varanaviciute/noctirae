"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { WeeklyInsight } from "@/lib/auth";
import { useT, useLocale } from "@/components/layout/LocaleProvider";

interface Props {
  existing: WeeklyInsight | null;
  shouldGenerate: boolean;
}

export function WeeklyInsightsPanel({ existing, shouldGenerate }: Props) {
  const t = useT();
  const locale = useLocale();
  const [insight, setInsight] = useState<WeeklyInsight | null>(existing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shouldGenerate) generate();
  }, []);

  async function generate(force = false) {
    setLoading(true);
    setError(null);
    try {
      const url = force ? "/api/insights/generate?force=true" : "/api/insights/generate";
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (data.insight) setInsight(data.insight);
      if (res.status === 429) setError(data.error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-5 flex items-center gap-3 text-dream-400">
        <Loader2 size={16} className="animate-spin text-dream-500" />
        <span className="text-sm">{t.weekly.generating}</span>
      </div>
    );
  }

  if (!insight) return null;

  const generatedDate = new Date(insight.generatedAt).toLocaleDateString(locale, {
    month: "short", day: "numeric",
  });

  return (
    <div className="glass-card rounded-2xl p-5 border border-dream-700/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-dream-300 flex items-center gap-2">
          <Sparkles size={14} className="text-yellow-400" />
          {t.weekly.title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dream-600">{t.weekly.updated} {generatedDate}</span>
          <button
            onClick={() => generate(true)}
            disabled={loading}
            className="text-dream-600 hover:text-dream-400 transition-colors"
            title="Regenerate"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
      <p className="text-sm text-dream-300 leading-relaxed mb-4">{insight.summary}</p>

      {insight.patterns.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-dream-500 uppercase tracking-wider mb-2">{t.weekly.patterns}</p>
          <ul className="space-y-1.5">
            {insight.patterns.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-dream-400">
                <span className="text-dream-600 flex-shrink-0">·</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insight.growthAreas.length > 0 && (
        <div>
          <p className="text-xs text-dream-500 uppercase tracking-wider mb-2">{t.weekly.growth}</p>
          <ul className="space-y-1.5">
            {insight.growthAreas.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm text-dream-400">
                <span className="text-yellow-500/60 flex-shrink-0">→</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
