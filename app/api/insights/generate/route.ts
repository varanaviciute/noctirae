import { NextRequest, NextResponse } from "next/server";
import { openai, DREAM_MODEL } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import { getUserWeeklyInsight, saveWeeklyInsight } from "@/lib/auth";

function isStale(insight: { generatedAt: string } | null): boolean {
  if (!insight) return true;
  const age = Date.now() - new Date(insight.generatedAt).getTime();
  return age > 7 * 24 * 60 * 60 * 1000;
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", user.id).single();
  if (!profile?.is_premium) return NextResponse.json({ error: "Premium only" }, { status: 403 });

  const force = new URL(request.url).searchParams.get("force") === "true";
  const existing = await getUserWeeklyInsight(user.id);

  if (!force && !isStale(existing)) {
    return NextResponse.json({ insight: existing, regenerated: false });
  }

  if (existing) {
    const today = new Date().toISOString().slice(0, 10);
    if (existing.generatedAt.slice(0, 10) === today && !force) {
      return NextResponse.json({ error: "Already regenerated today. Come back tomorrow.", insight: existing }, { status: 429 });
    }
  }

  const { data: dreams } = await supabase
    .from("dreams")
    .select("content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!dreams || dreams.length < 3) {
    return NextResponse.json({ error: "Not enough dreams" }, { status: 400 });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const isActive = dreams.some((d) => new Date(d.created_at) >= weekAgo);
  if (!isActive) {
    return NextResponse.json({ insight: existing, regenerated: false });
  }

  const dreamSummaries = dreams
    .map((d, i) => `Dream ${i + 1}: ${d.content.slice(0, 200)}`)
    .join("\n\n");

  const locale = request.cookies.get("locale")?.value ?? "en";
  const languageMap: Record<string, string> = {
    en: "English", lt: "Lithuanian", de: "German", fr: "French",
    es: "Spanish", pt: "Portuguese", it: "Italian", pl: "Polish",
    ru: "Russian", uk: "Ukrainian", zh: "Chinese", ja: "Japanese",
  };
  const language = languageMap[locale] ?? "English";

  const prompt = `You are a depth psychologist analyzing a person's dream journal over time.
Based on the following ${dreams.length} dreams, provide long-term psychological insights in JSON format only. No markdown.
IMPORTANT: Write ALL text values in ${language}.

Dreams:
${dreamSummaries}

Respond with:
{
  "summary": "2-3 sentence overview of the person's psychological landscape based on recurring patterns",
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "growthAreas": ["growth opportunity 1", "growth opportunity 2", "growth opportunity 3"]
}`;

  const completion = await openai.chat.completions.create({
    model: DREAM_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content ?? "{}");

  const insight = {
    userId: user.id,
    summary: result.summary ?? "",
    patterns: result.patterns ?? [],
    growthAreas: result.growthAreas ?? [],
    generatedAt: new Date().toISOString(),
  };

  await saveWeeklyInsight(insight);

  return NextResponse.json({ insight, regenerated: true });
}
