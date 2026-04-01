"use client";

import { useRouter } from "next/navigation";
import { X, Crown } from "lucide-react";
import { useT } from "@/components/layout/LocaleProvider";

interface Props {
  onClose?: () => void;
}

export function AuthGateModal({ onClose }: Props) {
  const router = useRouter();
  const t = useT();

  function handleClose() {
    if (onClose) {
      onClose();
    } else {
      router.push("/chat");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative glass-card rounded-2xl p-8 max-w-sm w-full mx-4 text-center dream-glow">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-dream-500 hover:text-dream-300 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 premium-gradient">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-dream-200 mb-2">{t.authGate.title}</h2>
        <p className="text-dream-400 text-sm mb-6">
          {t.authGate.subtitle}
        </p>
        <a
          href="/login"
          className="block w-full py-3 rounded-xl premium-gradient text-white font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          {t.authGate.button}
        </a>
        <button
          onClick={handleClose}
          className="mt-3 text-dream-600 text-xs hover:text-dream-400 transition-colors"
        >
          {t.authGate.later}
        </button>
      </div>
    </div>
  );
}
