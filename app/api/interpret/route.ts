import { NextRequest, NextResponse } from "next/server";
import { DreamInterpretation } from "@/types";
import { openai, buildDreamPrompt, DREAM_MODEL } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

async function getInterpretation(dreamText: string, isPremium: boolean, locale: string): Promise<DreamInterpretation> {
  const prompt = buildDreamPrompt(dreamText, isPremium, locale);
  const completion = await openai.chat.completions.create({
    model: DREAM_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });
  return JSON.parse(completion.choices[0].message.content ?? "{}") as DreamInterpretation;
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dreamText } = await request.json();

  if (!dreamText?.trim()) {
    return NextResponse.json({ error: "Dream text is required" }, { status: 400 });
  }

  const wordCount = dreamText.trim().split(/\s+/).length;
  if (wordCount > 500) {
    return NextResponse.json({ error: "Dream text exceeds 500 word limit" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();
  const isPremium = profile?.is_premium ?? false;

  if (!isPremium) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("dreams")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());
    if ((count ?? 0) >= 1) {
      return NextResponse.json(
        { error: "Free tier allows 1 dream per day. Upgrade to Premium for unlimited interpretations." },
        { status: 429 }
      );
    }
  }

  const locale = request.cookies.get("locale")?.value ?? "en";
  const interpretation = await getInterpretation(dreamText, isPremium, locale);

  const words = dreamText.trim().split(/\s+/);
  let title = "";
  for (const w of words) {
    if ((title + " " + w).trim().length > 60) break;
    title = (title + " " + w).trim();
  }

  await supabase.from("dreams").insert({
    user_id: user.id,
    title: title || dreamText.slice(0, 60),
    content: dreamText,
    interpretation,
    symbols: interpretation.symbols.map((s) => s.symbol),
  });

  return NextResponse.json({ interpretation, isPremium });
}
