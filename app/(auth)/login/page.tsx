"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Moon, Sparkles, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/layout/LocaleProvider";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const language = (data.user?.user_metadata?.language as string) ?? "en";
    localStorage.setItem("language", language);
    document.cookie = `locale=${language};path=/;max-age=31536000`;

    router.push("/chat");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dream-700/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-800/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass dream-glow mb-4">
            <Moon className="w-8 h-8 text-dream-400" />
          </div>
          <h1 className="text-3xl font-bold glow-text text-dream-200">Noctirae</h1>
          <p className="text-dream-500 mt-2 text-sm">{t.auth.taglineLogin}</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 dream-glow">
          <h2 className="text-xl font-semibold text-dream-100 mb-6">{t.auth.welcomeBack}</h2>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <label className="block text-sm text-dream-400 mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl glass text-dream-100 placeholder-dream-600 focus:outline-none focus:ring-2 focus:ring-dream-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dream-500 hover:text-dream-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-dream-400/50"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.auth.signingIn}
                </span>
              ) : (
                t.auth.signIn
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-dream-500">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="text-dream-400 hover:text-dream-300 font-medium transition-colors">
              {t.auth.createOneLink}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-dream-700 mt-6 flex items-center justify-center gap-1">
          <Sparkles size={12} />
          {t.auth.freeForever}
        </p>
      </div>
    </div>
  );
}
