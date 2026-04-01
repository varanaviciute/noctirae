import { cookies } from "next/headers";
import { getUser, getUserDreams, getUserWeeklyInsight } from "@/lib/auth";
import { loadTranslations } from "@/lib/i18n";
import { PremiumGate } from "@/components/layout/PremiumGate";
import { AuthGateModal } from "@/components/layout/AuthGateModal";
import { WeeklyInsightsPanel } from "@/components/insights/WeeklyInsightsPanel";
import { BarChart3, TrendingUp, RefreshCw, Heart, Brain, Lightbulb } from "lucide-react";
import { Dream } from "@/types";

function buildLifeSnapshot(dreams: Dream[]) {
  const insights = dreams.map((d) => d.interpretation?.insights).filter(Boolean) as string[];
  const recommendations = dreams.flatMap((d) => {
    const r = d.interpretation?.recommendations;
    if (!r) return [];
    return Array.isArray(r) ? r : [r];
  }).filter(Boolean) as string[];
  const psychologicals = dreams.map((d) => d.interpretation?.psychological).filter(Boolean) as string[];
  return { insights, recommendations, psychologicals };
}

function getTopItems(items: string[], topN = 5): Array<{ value: string; count: number }> {
  const freq: Record<string, number> = {};
  items.forEach((item) => { if (item) freq[item] = (freq[item] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([value, count]) => ({ value, count }));
}

export default async function InsightsPage() {
  const user = await getUser();
  if (!user) return <AuthGateModal />;
  if (!user.isPremium) return <PremiumGate />;

  const locale = cookies().get("locale")?.value ?? user.language ?? "en";
  const t = await loadTranslations(locale);

  const dreams = await getUserDreams(user.id);
  const allSymbols = dreams.flatMap((d) => d.symbols || []);
  const allEmotions = dreams.flatMap((d) => d.emotions || []);
  const topSymbols = getTopItems(allSymbols);
  const topEmotions = getTopItems(allEmotions);
  const totalDreams = dreams.length;
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = dreams.filter((d) => new Date(d.created_at) >= weekAgo).length;
  const { insights, recommendations, psychologicals } = buildLifeSnapshot(dreams);
  const weeklyInsight = await getUserWeeklyInsight(user.id);
  const isActive = thisWeek > 0;
  const isStale = !weeklyInsight || (Date.now() - new Date(weeklyInsight.generatedAt).getTime()) > 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-dream-500" />
        <h1 className="text-lg font-semibold text-dream-200">{t.insights.title}</h1>
      </div>

      {totalDreams < 3 ? (
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <div className="text-4xl mb-3">🔭</div>
          <h2 className="text-dream-200 font-semibold mb-2">{t.insights.notEnough}</h2>
          <p className="text-dream-400 text-sm">{t.insights.notEnoughSub(totalDreams)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <WeeklyInsightsPanel
            existing={weeklyInsight}
            shouldGenerate={isActive && isStale && totalDreams >= 3}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<RefreshCw size={18} className="text-dream-400" />} label={t.insights.totalDreams} value={totalDreams.toString()} />
            <StatCard icon={<TrendingUp size={18} className="text-green-400" />} label={t.insights.thisWeek} value={thisWeek.toString()} />
          </div>

          {topSymbols.length > 0 && (
            <PatternSection title={t.insights.recurringSymbols} icon="✨">
              {topSymbols.map(({ value, count }) => (
                <PatternBar key={value} label={value} count={count} max={topSymbols[0].count} color="dream" />
              ))}
              {topSymbols[0]?.count >= 2 && (
                <p className="text-xs text-dream-500 mt-3 italic">
                  {t.insights.symbolSignificance(topSymbols[0].value, topSymbols[0].count)}
                </p>
              )}
            </PatternSection>
          )}

          {topEmotions.length > 0 && (
            <PatternSection title={t.insights.emotionalPatterns} icon={<Heart size={14} className="inline text-pink-400" />}>
              <div className="flex flex-wrap gap-2">
                {topEmotions.map(({ value, count }) => (
                  <div key={value} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-dream-800/30">
                    <span className="text-sm text-dream-300 capitalize">{value}</span>
                    <span className="text-xs text-dream-600 font-mono">×{count}</span>
                  </div>
                ))}
              </div>
            </PatternSection>
          )}

          {(psychologicals.length > 0 || insights.length > 0) && (
            <PatternSection title={t.insights.lifeSnapshot} icon={<Brain size={14} className="inline text-blue-400" />}>
              <div className="space-y-3">
                {psychologicals.slice(0, 3).map((text, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0 mt-2" />
                    <p className="text-sm text-dream-300 leading-relaxed">{text}</p>
                  </div>
                ))}
                {insights.slice(0, 2).map((text, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 flex-shrink-0 mt-2" />
                    <p className="text-sm text-dream-300 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </PatternSection>
          )}

          {recommendations.length > 0 && (
            <PatternSection title={t.insights.recommendations} icon={<Lightbulb size={14} className="inline text-yellow-400" />}>
              <div className="space-y-2">
                {recommendations.slice(0, 5).map((text, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-dream-900/30">
                    <span className="text-yellow-400/70 text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                    <p className="text-sm text-dream-300 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </PatternSection>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs text-dream-500">{label}</p>
        <p className="text-2xl font-bold text-dream-200">{value}</p>
      </div>
    </div>
  );
}

function PatternSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-dream-300 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

function PatternBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-dream-300 capitalize">{label}</span>
        <span className="text-dream-600">×{count}</span>
      </div>
      <div className="h-1.5 bg-dream-900/60 rounded-full overflow-hidden">
        <div className="h-full bg-dream-600/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
