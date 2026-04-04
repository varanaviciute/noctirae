"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/layout/LocaleProvider";

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to send reset email");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dream-700/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-800/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass dream-glow mb-4">
            <Moon className="w-8 h-8 text-dream-400" />
          </div>
          <h1 className="text-3xl font-bold glow-text text-dream-200">Noctirae</h1>
        </div>

        <div className="glass-card rounded-2xl p-8 dream-glow">
          {sent ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-dream-100 mb-3">{t.auth.resetLinkSent}</h2>
              <p className="text-dream-400 text-sm mb-1">
                {t.auth.resetLinkSentDesc}{" "}
                <span className="text-dream-200 font-medium">{email}</span>
              </p>
              <Link href="/login" className="mt-6 inline-block text-sm text-dream-600 hover:text-dream-400 transition-colors">
                {t.auth.backToLogin}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-dream-100 mb-2">{t.auth.forgotPasswordTitle}</h2>
              <p className="text-dream-500 text-sm mb-6">{t.auth.forgotPasswordDesc}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-dream-400 mb-1.5">{t.auth.email}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-dream-100 placeholder-dream-600 focus:outline-none focus:ring-2 focus:ring-dream-500/50 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full py-3 rounded-xl font-semibold text-white transition-all",
                    "premium-gradient hover:opacity-90 active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.auth.sendingResetLink}
                    </span>
                  ) : t.auth.sendResetLink}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/login" className="text-sm text-dream-600 hover:text-dream-400 transition-colors">
                  {t.auth.backToLogin}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
