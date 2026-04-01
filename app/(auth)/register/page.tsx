"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Eye, EyeOff, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/components/layout/LocaleProvider";

const LANGUAGES = [
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "lt", label: "Lietuvių",   flag: "🇱🇹" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "pt", label: "Português",  flag: "🇵🇹" },
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "pl", label: "Polski",     flag: "🇵🇱" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "zh", label: "中文",        flag: "🇨🇳" },
  { code: "ja", label: "日本語",      flag: "🇯🇵" },
];

export default function RegisterPage() {
  const router = useRouter();
  const t = useT();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedLang = LANGUAGES.find((l) => l.code === language)!;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) { setError(t.auth.fullNameError); return; }
    if (password.length < 8) { setError(t.auth.passwordError); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: fullName, language },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }
      setStep(2);
    } catch {
      setError(t.auth.fullNameError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-dream-700/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-purple-800/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass dream-glow mb-4">
            <Moon className="w-8 h-8 text-dream-400" />
          </div>
          <h1 className="text-3xl font-bold glow-text text-dream-200">Noctirae</h1>
          <p className="text-dream-500 mt-2 text-sm">{t.auth.taglineRegister}</p>
        </div>

        <div className="glass-card rounded-2xl p-8 dream-glow">
          {step === 1 ? (
            <>
              <h2 className="text-xl font-semibold text-dream-100 mb-6">{t.auth.createAccount}</h2>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-dream-400 mb-1.5">{t.auth.fullName}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.auth.fullNamePlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl glass text-dream-100 placeholder-dream-600 focus:outline-none focus:ring-2 focus:ring-dream-500/50 transition-all"
                  />
                </div>

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
                  <label className="block text-sm text-dream-400 mb-1.5">
                    {t.auth.password} <span className="text-dream-600">{t.auth.passwordHint}</span>
                  </label>
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

                <div>
                  <label className="block text-sm text-dream-400 mb-1.5">{t.auth.selectLanguage}</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setLangOpen(!langOpen)}
                      className="w-full px-4 py-3 rounded-xl glass text-dream-100 focus:outline-none focus:ring-2 focus:ring-dream-500/50 transition-all flex items-center justify-between"
                    >
                      <span>{selectedLang.flag} {selectedLang.label}</span>
                      <ChevronDown size={16} className={cn("text-dream-500 transition-transform", langOpen && "rotate-180")} />
                    </button>
                    {langOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-y-auto z-50 border border-dream-700/50 max-h-48 shadow-xl" style={{ background: "#0f0e1f" }}>
                          {LANGUAGES.map(({ code, label, flag }) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => { setLanguage(code); setLangOpen(false); }}
                              className={cn(
                                "w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-all hover:bg-dream-900/40 text-left",
                                language === code ? "text-dream-200 bg-dream-800/20" : "text-dream-400"
                              )}
                            >
                              <span>{flag}</span>
                              <span>{label}</span>
                              {language === code && <span className="ml-auto text-dream-600 text-xs">✓</span>}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
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
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.auth.creatingAccount}
                    </span>
                  ) : t.auth.createFree}
                </button>
              </form>

              <div className="mt-4 p-3 rounded-xl bg-dream-900/30 border border-dream-800/30">
                <p className="text-xs text-dream-500 text-center">{t.auth.freeIncludes}</p>
              </div>

              <div className="mt-4 text-center text-sm text-dream-500">
                {t.auth.haveAccount}{" "}
                <Link href="/login" className="text-dream-400 hover:text-dream-300 font-medium transition-colors">
                  {t.auth.signInLink}
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-dream-400" />
              </div>
              <h2 className="text-xl font-semibold text-dream-100 mb-3">{t.auth.checkEmail}</h2>
              <p className="text-dream-400 text-sm mb-1">
                {t.auth.confirmSent}{" "}
                <span className="text-dream-200 font-medium">{email}</span>
              </p>
              <p className="text-dream-500 text-xs mb-8">{t.auth.confirmClick}</p>

              <button
                onClick={() => { setStep(1); setError(""); }}
                className="text-sm text-dream-600 hover:text-dream-400 transition-colors"
              >
                {t.auth.backToLogin}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
