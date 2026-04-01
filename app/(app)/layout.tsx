import { getUser } from "@/lib/auth";
import { AppNav } from "@/components/layout/AppNav";
import { NightSkyBackground } from "@/components/chat/NightSkyBackground";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const isLoggedIn = !!user;
  const isPremium = user?.isPremium ?? false;
  const userName = user?.name ?? "";

  return (
    <div className="min-h-screen flex relative">
      <NightSkyBackground />
      <AppNav isPremium={isPremium} isLoggedIn={isLoggedIn} userName={userName} />
      <main className="flex-1 md:ml-64 flex flex-col pt-11 md:pt-0 relative z-10 overflow-y-auto" style={{ height: "100dvh" }}>
        {children}
      </main>
    </div>
  );
}
