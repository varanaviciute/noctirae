import { cookies } from "next/headers";
import { getUser, getUserDreams } from "@/lib/auth";
import { loadTranslations } from "@/lib/i18n";
import { PremiumGate } from "@/components/layout/PremiumGate";
import { AuthGateModal } from "@/components/layout/AuthGateModal";
import { JournalList } from "@/components/journal/JournalList";
import { BookOpen } from "lucide-react";

export default async function JournalPage() {
  const user = await getUser();
  if (!user) return <AuthGateModal />;
  if (!user.isPremium) return <PremiumGate />;

  const locale = cookies().get("locale")?.value ?? user.language ?? "en";
  const t = await loadTranslations(locale);

  const dreams = await getUserDreams(user.id);

  return (
    <div className="flex flex-col h-full px-4 md:px-8 py-6 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-dream-500" />
          <h1 className="text-lg font-semibold text-dream-200">{t.journal.title}</h1>
        </div>
        <p className="text-dream-500 text-sm mt-1">{t.journal.dreamsRecorded(dreams.length)}</p>
      </div>
      <JournalList dreams={dreams} />
    </div>
  );
}
