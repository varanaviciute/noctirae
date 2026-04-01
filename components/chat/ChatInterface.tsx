"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Moon, Sparkles, Plus } from "lucide-react";
import { ChatMessage, DreamInterpretation } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { VoiceRecorder } from "./VoiceRecorder";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useT } from "@/components/layout/LocaleProvider";

interface ChatInterfaceProps {
  isPremium: boolean;
}

export function ChatInterface({ isPremium }: ChatInterfaceProps) {
  const t = useT();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hint, setHint] = useState(t.chat.hints[0]);

  useEffect(() => {
    setHint(t.chat.hints[Math.floor(Math.random() * t.chat.hints.length)]);
  }, [t]);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const WORD_LIMIT = 500;

  const hasResponse = messages.some((m) => m.role === "assistant");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const words = e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0;
    if (words > WORD_LIMIT) return;
    setInput(e.target.value);
    if (inputError) setInputError("");
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (loading) return;
    if (!text) {
      setInputError(t.chat.errorEmpty);
      textareaRef.current?.focus();
      return;
    }

    setInputError("");
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamText: text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || t.chat.errorFailed);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t.chat.interpretationIntro,
        dreamData: data.interpretation as DreamInterpretation,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: err instanceof Error ? err.message : t.chat.errorFailed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleNewDream() {
    setMessages([]);
    setInput("");
    setInputError("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  return (
    <div className="flex flex-col h-full min-h-0" style={{ height: "100dvh" }}>
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {messages.length === 0 ? (
          <WelcomeState
            hint={hint}
            isPremium={isPremium}
            onUseHint={(text) => {
              setInput(text);
              textareaRef.current?.focus();
            }}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                dreamData={msg.dreamData}
                isPremium={isPremium}
              />
            ))}
            {loading && <TypingIndicator text={t.chat.interpreting} />}
            {hasResponse && !loading && (
              <div className="flex justify-center mt-4 mb-2">
                <button
                  onClick={handleNewDream}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-dream-800/30 text-dream-400 hover:text-dream-200 hover:bg-dream-900/40 text-sm transition-all"
                >
                  <Plus size={15} />
                  {t.chat.interpretAnother}
                </button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-4 md:px-8 py-4 border-t border-dream-900/30 bg-midnight/80 backdrop-blur-sm relative z-10">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className={cn(
            "flex items-end gap-2 glass-card rounded-2xl p-2 transition-all",
            inputError && "border-red-500/40"
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={t.chat.placeholder}
              rows={1}
              className="flex-1 bg-transparent px-3 py-2 text-dream-100 placeholder-dream-600 resize-none focus:outline-none text-sm leading-relaxed"
              style={{ maxHeight: "200px" }}
              disabled={loading}
            />
            <div className="flex items-center gap-1 flex-shrink-0">
              <VoiceRecorder
                onTranscript={(text) => {
                  setInput((prev) => prev + (prev ? " " : "") + text);
                  if (inputError) setInputError("");
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || wordCount > WORD_LIMIT}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  "premium-gradient text-white",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:opacity-90 active:scale-95"
                )}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            {inputError ? (
              <p className="text-xs text-red-400">{inputError}</p>
            ) : (
              <p className="text-xs text-dream-700">
                {isPremium ? t.chat.premiumTier : t.chat.freeTier}
              </p>
            )}
            <p className={cn("text-xs", wordCount >= WORD_LIMIT ? "text-red-400" : "text-dream-700")}>
              {wordCount}/{WORD_LIMIT}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function WelcomeState({
  hint,
  isPremium,
  onUseHint,
}: {
  hint: string;
  isPremium: boolean;
  onUseHint: (text: string) => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 max-w-lg mx-auto">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full premium-gradient opacity-20 absolute inset-0 blur-2xl animate-pulse-slow" />
        <div className="w-24 h-24 rounded-full glass flex items-center justify-center dream-glow relative">
          <Moon className="w-12 h-12 text-dream-300 animate-float" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-dream-100 mb-2 glow-text">{t.chat.title}</h2>
      <p className="text-dream-400 text-sm mb-8">{t.chat.subtitle}</p>

      <button
        onClick={() => onUseHint(hint)}
        className="w-full glass-card rounded-2xl p-4 text-left hover:border-dream-700/40 transition-all group"
      >
        <p className="text-xs text-dream-600 mb-2 flex items-center gap-1">
          <Sparkles size={12} /> {t.chat.exampleLabel}
        </p>
        <p className="text-dream-400 text-sm italic group-hover:text-dream-300 transition-colors">"{hint}"</p>
      </button>

      {!isPremium && (
        <Link
          href="/settings"
          className="mt-6 w-full p-3 rounded-xl border border-dream-800/30 bg-dream-950/30 hover:bg-dream-900/30 hover:border-dream-700/40 transition-all block"
        >
          <p className="text-xs text-dream-500">{t.chat.upgradeBanner}</p>
        </Link>
      )}
    </div>
  );
}

function TypingIndicator({ text }: { text: string }) {
  return (
    <div className="flex justify-start mb-4">
      <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <Moon size={14} className="text-dream-500 animate-pulse" />
        <span className="text-dream-500 text-sm">{text}</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-dream-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
