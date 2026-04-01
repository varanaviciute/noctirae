"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(localStorage.getItem("theme") === "light");
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.add("light");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.remove("light");
    }
  }

  return (
    <button
      onClick={toggle}
      className="w-full glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-dream-900/40 transition-all"
    >
      <div className="flex items-center gap-3">
        {isLight ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-dream-400" />}
        <span className="text-sm font-medium text-dream-300">
          {isLight ? "Light mode" : "Dark mode"}
        </span>
      </div>
      <div className={`w-10 h-5 rounded-full transition-colors relative ${isLight ? "bg-dream-500" : "bg-dream-800"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isLight ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
    </button>
  );
}
