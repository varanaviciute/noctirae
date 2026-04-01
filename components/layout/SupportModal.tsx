"use client";

import { useState } from "react";
import { X, HelpCircle, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/layout/LocaleProvider";

interface SupportModalProps {
  onClose: () => void;
  defaultEmail?: string;
  userId?: string;
}

export function SupportModal({ onClose, defaultEmail = "", userId }: SupportModalProps) {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = t.support.nameError;
    if (!email.trim()) errors.email = t.support.emailError;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t.support.emailInvalid;
    if (!question.trim()) errors.question = t.support.questionError;
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setLoading(true);
    setError("");

    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, question, userId }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? t.support.genericError);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-dream-800/30 dream-glow">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-dream-500 hover:text-dream-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-dream-400" />
          </div>
          <h2 className="text-dream-200 font-semibold">{t.support.title}</h2>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-dream-200 font-semibold mb-1">{t.support.sent}</p>
            <p className="text-dream-400 text-sm">{t.support.sentSub}</p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 rounded-xl premium-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {t.support.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-dream-500 mb-1.5">{t.support.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
                placeholder={t.support.namePlaceholder}
                className={cn("w-full bg-dream-950/40 border rounded-xl px-4 py-2.5 text-sm text-dream-200 placeholder-dream-600 focus:outline-none transition-colors", fieldErrors.name ? "border-red-500/50" : "border-dream-800/30 focus:border-dream-700/50")}
              />
              {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="block text-xs text-dream-500 mb-1.5">{t.support.email}</label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                placeholder={t.support.emailPlaceholder}
                className={cn("w-full bg-dream-950/40 border rounded-xl px-4 py-2.5 text-sm text-dream-200 placeholder-dream-600 focus:outline-none transition-colors", fieldErrors.email ? "border-red-500/50" : "border-dream-800/30 focus:border-dream-700/50")}
              />
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-xs text-dream-500 mb-1.5">{t.support.question}</label>
              <textarea
                value={question}
                onChange={(e) => { setQuestion(e.target.value); setFieldErrors((p) => ({ ...p, question: "" })); }}
                rows={4}
                placeholder={t.support.questionPlaceholder}
                className={cn("w-full bg-dream-950/40 border rounded-xl px-4 py-2.5 text-sm text-dream-200 placeholder-dream-600 focus:outline-none transition-colors resize-none", fieldErrors.question ? "border-red-500/50" : "border-dream-800/30 focus:border-dream-700/50")}
              />
              {fieldErrors.question && <p className="text-xs text-red-400 mt-1">{fieldErrors.question}</p>}
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-white text-sm transition-all",
                "premium-gradient hover:opacity-90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> {t.support.sending}
                </span>
              ) : t.support.send}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
