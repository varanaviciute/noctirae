import { createClient } from "@/lib/supabase/server";
import { Dream } from "@/types";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  language: string;
}

export interface WeeklyInsight {
  userId: string;
  summary: string;
  patterns: string[];
  growthAreas: string[];
  generatedAt: string;
}

export async function getUser(): Promise<AppUser | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, name, language")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email ?? "",
      name: profile?.name ?? (user.user_metadata?.name as string) ?? "",
      isPremium: profile?.is_premium ?? false,
      language: profile?.language ?? (user.user_metadata?.language as string) ?? "en",
    };
  } catch {
    return null;
  }
}

export async function getUserDreams(userId: string): Promise<Dream[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("dreams")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []).map((d) => ({ ...d, emotions: d.emotions ?? [] })) as Dream[];
  } catch {
    return [];
  }
}

export async function getUserWeeklyInsight(userId: string): Promise<WeeklyInsight | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("weekly_insights")
      .select("*")
      .eq("user_id", userId)
      .order("generated_at", { ascending: false })
      .limit(1)
      .single();
    if (!data) return null;
    return {
      userId: data.user_id,
      summary: data.content?.summary ?? "",
      patterns: data.content?.patterns ?? [],
      growthAreas: data.content?.growthAreas ?? [],
      generatedAt: data.generated_at,
    };
  } catch {
    return null;
  }
}

export async function saveWeeklyInsight(insight: WeeklyInsight): Promise<void> {
  const supabase = createClient();
  await supabase.from("weekly_insights").delete().eq("user_id", insight.userId);
  await supabase.from("weekly_insights").insert({
    user_id: insight.userId,
    content: {
      summary: insight.summary,
      patterns: insight.patterns,
      growthAreas: insight.growthAreas,
    },
    generated_at: insight.generatedAt,
  });
}
