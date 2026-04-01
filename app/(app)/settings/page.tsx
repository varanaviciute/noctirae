"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Settings, Crown, LogOut, Loader2, CheckCircle, XCircle, ChevronRight, Trash2, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthGateModal } from "@/components/layout/AuthGateModal";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { SupportModal } from "@/components/layout/SupportModal";
import { useT } from "@/components/layout/LocaleProvider";

interface ProfileData {
  email: string;
  is_premium: boolean;
  streak_count: number;
  created_at: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/mock-me");
      if (!res.ok) { setLoading(false); setShowAuthGate(true); return; }
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubscribe() {
    setSubscribing(true);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selectedPlan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setSubscribing(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/mock-logout", { method: "POST" });
    router.push("/chat");
    router.refresh();
  }

  async function handleDeleteAccount() {
    await fetch("/api/mock-delete-account", { method: "POST" });
    router.push("/chat");
    router.refresh();
  }

  if (showAuthGate) return <AuthGateModal />;

  const supportModal = showSupport && (
    <SupportModal
      onClose={() => setShowSupport(false)}
      defaultEmail={profile?.email ?? ""}
      userId={profile?.email ?? undefined}
    />
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-dream-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto w-full">
      {supportModal}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-dream-500" />
        <h1 className="text-lg font-semibold text-dream-200">{t.settings.title}</h1>
      </div>

      {/* Success / canceled banners */}
      {success && (
        <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-400" />
          <p className="text-green-300 text-sm">{t.settings.successBanner}</p>
        </div>
      )}
      {canceled && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <XCircle size={18} className="text-red-400" />
          <p className="text-red-300 text-sm">{t.settings.canceledBanner}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Account card */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-dream-400 uppercase tracking-wider mb-4">{t.settings.account}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dream-400 text-sm">{t.settings.email}</span>
              <span className="text-dream-200 text-sm">{profile?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dream-400 text-sm">{t.settings.plan}</span>
              <span className={cn(
                "text-sm font-semibold flex items-center gap-1",
                profile?.is_premium ? "text-yellow-400" : "text-dream-500"
              )}>
                {profile?.is_premium && <Crown size={14} />}
                {profile?.is_premium ? t.settings.premium : t.settings.free}
              </span>
            </div>
            {profile?.streak_count != null && profile.streak_count > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-dream-400 text-sm">{t.settings.streak}</span>
                <span className="text-orange-300 text-sm font-semibold">🔥 {profile.streak_count} {t.settings.days}</span>
              </div>
            )}
          </div>
        </div>

        {/* Subscription card */}
        {!profile?.is_premium ? (
          <div className="glass-card rounded-2xl p-5 border border-dream-700/30 dream-glow">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={18} className="text-yellow-400" />
              <h2 className="font-semibold text-dream-200">{t.settings.upgradePremium}</h2>
            </div>
            <ul className="space-y-2 mb-5">
              {t.settings.features.map((feature: string) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-dream-300">
                  <CheckCircle size={14} className="text-dream-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Plan selector */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  selectedPlan === "monthly"
                    ? "border-dream-500/60 bg-dream-800/40"
                    : "border-dream-800/30 hover:border-dream-700/40"
                )}
              >
                <p className="text-sm font-semibold text-dream-200">{t.settings.monthly}</p>
                <p className="text-xs text-dream-400">€5.99 {t.settings.perMonth}</p>
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all relative overflow-hidden",
                  selectedPlan === "yearly"
                    ? "border-dream-500/60 bg-dream-800/40"
                    : "border-dream-800/30 hover:border-dream-700/40"
                )}
              >
                <span className="absolute top-1.5 right-1.5 text-[10px] bg-dream-600/60 text-dream-200 px-1.5 py-0.5 rounded-full">{t.settings.save30}</span>
                <p className="text-sm font-semibold text-dream-200">{t.settings.yearly}</p>
                <p className="text-xs text-dream-400">€49.99 {t.settings.perYear}</p>
              </button>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-white transition-all",
                "premium-gradient hover:opacity-90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {subscribing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Loading...
                </span>
              ) : (
                t.settings.trialButton
              )}
            </button>
            <p className="text-center text-xs text-dream-600 mt-2">{t.settings.cancelStripe}</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-dream-200">{t.settings.premiumActive}</p>
              </div>
              <Crown size={20} className="text-yellow-400" />
            </div>
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="w-full py-2 rounded-xl text-xs text-dream-500 hover:text-dream-300 border border-dream-800/30 hover:bg-dream-900/40 transition-all"
            >
              {t.settings.deactivate}
            </button>
          </div>
        )}

        {/* Language & Theme */}
        <LanguageSelector />
        <ThemeToggle />

        {/* Help */}
        <button
          onClick={() => setShowSupport(true)}
          className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 text-dream-400 hover:text-dream-200 hover:bg-dream-900/40 transition-all"
        >
          <HelpCircle size={18} />
          <span className="text-sm font-medium">{t.settings.help}</span>
          <ChevronRight size={16} className="ml-auto opacity-40" />
        </button>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">{t.nav.signOut}</span>
          <ChevronRight size={16} className="ml-auto opacity-40" />
        </button>

        {/* Delete account */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 text-dream-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">{t.settings.deleteAccount}</span>
            <ChevronRight size={16} className="ml-auto opacity-40" />
          </button>
        ) : (
          <div className="glass-card rounded-2xl p-5 border border-red-500/20">
            <p className="text-sm text-dream-300 mb-4">
              {t.settings.deleteConfirm}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold hover:bg-red-500/30 transition-all"
              >
                {t.settings.deleteYes}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl glass text-dream-400 text-sm font-medium hover:text-dream-200 transition-all"
              >
                {t.settings.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legal links */}
      <div className="flex items-center justify-center gap-4 mt-8 pb-4">
        <Link href="/privacy" className="text-xs text-dream-600 hover:text-dream-400 transition-colors">
          {t.settings.privacy}
        </Link>
        <span className="text-dream-800 text-xs">·</span>
        <Link href="/terms" className="text-xs text-dream-600 hover:text-dream-400 transition-colors">
          {t.settings.terms}
        </Link>
      </div>
    </div>
  );
}
