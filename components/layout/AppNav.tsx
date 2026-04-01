"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, BookOpen, BarChart3, Settings, Moon, Crown, LogIn, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthGateModal } from "@/components/layout/AuthGateModal";
import { useT } from "@/components/layout/LocaleProvider";

const NAV_ITEMS = [
  { href: "/chat", icon: MessageCircle, key: "chat" },
  { href: "/journal", icon: BookOpen, key: "journal", premium: true },
  { href: "/insights", icon: BarChart3, key: "insights", premium: true },
];

interface AppNavProps {
  isPremium: boolean;
  isLoggedIn: boolean;
  userName?: string;
}

export function AppNav({ isPremium, isLoggedIn, userName }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleNavClick(e: React.MouseEvent, href: string) {
    setDrawerOpen(false);
    if (!isLoggedIn && href !== "/chat") {
      e.preventDefault();
      setShowAuthGate(true);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleSignOut() {
    setDrawerOpen(false);
    await fetch("/api/mock-logout", { method: "POST" });
    router.push("/chat");
    router.refresh();
  }

  const navItems = NAV_ITEMS;

  function NavLinks() {
    return (
      <>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, key, premium }) => {
            const isActive = pathname === href;
            const isLocked = (premium && !isPremium) || (!isLoggedIn && href !== "/chat");
            const label = t.nav[key as keyof typeof t.nav] as string;
            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-dream-600/20 text-dream-200 border border-dream-700/30"
                    : "text-dream-500 hover:text-dream-300 hover:bg-dream-900/40",
                  isLocked && "opacity-60"
                )}
              >
                <Icon size={18} />
                {label}
                {isLocked && <Crown size={12} className="ml-auto text-yellow-500/60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2">
          {isLoggedIn && !isPremium && (
            <Link
              href="/settings"
              onClick={() => setDrawerOpen(false)}
              className="block w-full py-3 px-4 rounded-xl premium-gradient text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity overflow-hidden"
            >
              <span className="block truncate">{t.nav.upgradePremium}</span>
              <span className="block text-xs font-normal opacity-80">{t.nav.upgradeSubtitle}</span>
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link
                href="/settings"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-dream-500 hover:text-dream-300 transition-all"
              >
                <Settings size={16} />
                {t.nav.settings}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-dream-400 bg-dream-900/40 hover:bg-dream-900/60 transition-all"
              >
                <LogOut size={16} />
                {t.nav.signOut}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl glass border border-dream-700/30 text-dream-300 text-sm font-semibold hover:bg-dream-900/40 transition-all"
            >
              <LogIn size={16} />
              {t.nav.signIn}
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {showAuthGate && <AuthGateModal onClose={() => setShowAuthGate(false)} />}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col glass-card border-r border-dream-900/30 z-40">
        <div className="p-6 border-b border-dream-900/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
              <Moon className="w-5 h-5 text-dream-400" />
            </div>
            <div>
              <h1 className="font-bold text-dream-200 text-sm">Noctirae</h1>
              {userName ? (
                <span className="text-xs text-dream-500 flex items-center gap-1">
                  {isPremium && <Crown size={10} className="text-yellow-400" />}
                  <span className="truncate max-w-[120px]">{userName}</span>
                </span>
              ) : isPremium && (
                <span className="text-xs text-dream-500 flex items-center gap-1">
                  <Crown size={10} className="text-yellow-400" /> {t.settings.premium}
                </span>
              )}
            </div>
          </div>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass-card border-b border-dream-900/30 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl glass flex items-center justify-center">
            <Moon className="w-4 h-4 text-dream-400" />
          </div>
          <span className="font-bold text-dream-200 text-sm">Noctirae</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl glass text-dream-400 hover:text-dream-200 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 h-full w-72 flex flex-col glass-card border-r border-dream-900/30 z-50 animate-in slide-in-from-left duration-200">
            <div className="p-5 border-b border-dream-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                  <Moon className="w-5 h-5 text-dream-400" />
                </div>
                <div>
                  <h1 className="font-bold text-dream-200 text-sm">Noctirae</h1>
                  {userName ? (
                    <span className="text-xs text-dream-500 flex items-center gap-1">
                      {isPremium && <Crown size={10} className="text-yellow-400" />}
                      <span className="truncate max-w-[120px]">{userName}</span>
                    </span>
                  ) : isPremium && (
                    <span className="text-xs text-dream-500 flex items-center gap-1">
                      <Crown size={10} className="text-yellow-400" /> {t.settings.premium}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-dream-500 hover:text-dream-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <NavLinks />
          </aside>
        </>
      )}
    </>
  );
}
