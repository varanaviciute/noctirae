import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();

  const newPremium = !(profile?.is_premium ?? false);

  await supabase.from("profiles").update({ is_premium: newPremium }).eq("id", user.id);

  return NextResponse.json({ isPremium: newPremium });
}
