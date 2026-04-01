"use client";

import { DreamInterpretation } from "@/types";
import { Brain, Star, List, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/layout/LocaleProvider";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  dreamData?: DreamInterpretation;
  isPremium?: boolean;
}

export function MessageBubble({ role, content, dreamData, isPremium }: MessageBubbleProps) {
  const t = useT();

  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-dream-700/30 border border-dream-600/20 text-dream-100">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  if (!dreamData) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm glass-card text-dream-200">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Summary */}
      <Section icon={<Star size={15} />} title={t.bubble.dreamSummary} color="dream-400">
        <p className="text-dream-200 text-sm leading-relaxed italic">"{dreamData.summary}"</p>
      </Section>

      {/* Psychological */}
      <Section icon={<Brain size={15} />} title={t.bubble.psychological} color="blue-400">
        <p className="text-dream-300 text-sm leading-relaxed">{dreamData.psychological}</p>
      </Section>

      {/* Esoteric */}
      <Section icon={<Sparkles size={15} />} title={t.bubble.esoteric} color="purple-400">
        <p className="text-dream-300 text-sm leading-relaxed">{dreamData.esoteric}</p>
      </Section>

      {/* Symbols */}
      {dreamData.symbols && dreamData.symbols.length > 0 && (
        <Section icon={<List size={15} />} title={t.bubble.keySymbols} color="teal-400">
          <ul className="space-y-2">
            {dreamData.symbols.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-dream-600 mt-0.5 flex-shrink-0">·</span>
                <span>
                  <span className="text-dream-200 font-medium">{s.symbol}</span>
                  {" — "}
                  <span className="text-dream-400">{s.meaning}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Premium sections */}
      {isPremium && dreamData.insights && (
        <Section icon={<Lightbulb size={15} />} title={t.bubble.patternInsight} color="yellow-400" premium premiumLabel={t.bubble.premium}>
          <p className="text-dream-300 text-sm leading-relaxed">{dreamData.insights}</p>
        </Section>
      )}

      {isPremium && dreamData.reflections && dreamData.reflections.length > 0 && (
        <Section title={t.bubble.reflections} color="pink-400" premium premiumLabel={t.bubble.premium}>
          <ul className="space-y-2">
            {dreamData.reflections.map((r, i) => (
              <li key={i} className="text-dream-300 text-sm flex items-start gap-2">
                <span className="text-dream-600 mt-0.5">•</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {isPremium && dreamData.recommendations && dreamData.recommendations.length > 0 && (
        <Section title={t.bubble.recommendations} color="green-400" premium premiumLabel={t.bubble.premium}>
          <ul className="space-y-2">
            {dreamData.recommendations.map((rec, i) => (
              <li key={i} className="text-dream-300 text-sm flex items-start gap-2">
                <span className="text-green-500/70 mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
  premium,
  premiumLabel,
}: {
  icon?: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
  premium?: boolean;
  premiumLabel?: string;
}) {
  return (
    <div className={cn(
      "glass-card rounded-xl p-4",
      premium && "border-dream-700/30 bg-gradient-to-r from-dream-950/60 to-purple-950/20"
    )}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className={`text-${color}`}>{icon}</span>}
        <h3 className={cn("text-xs font-semibold uppercase tracking-wider", `text-${color}`)}>
          {title}
        </h3>
        {premium && (
          <span className="ml-auto text-xs text-dream-600 border border-dream-800/50 rounded px-1.5 py-0.5">
            {premiumLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
