"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { useT } from "@/components/layout/LocaleProvider";

export function PremiumGate() {
  const t = useT();

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="glass-card rounded-2xl p-10 text-center max-w-sm dream-glow">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 premium-gradient">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dream-200 mb-2">{t.premiumGate.title}</h2>
        <p className="text-dream-400 text-sm mb-6">
          {t.premiumGate.subtitle}
        </p>
        <Link
          href="/settings"
          className="inline-block w-full py-3 rounded-xl premium-gradient text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {t.premiumGate.button}
        </Link>
        <p className="text-dream-600 text-xs mt-3">{t.premiumGate.trial}</p>
      </div>
    </div>
  );
}
