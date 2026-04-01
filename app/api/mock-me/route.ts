import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not logged in" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, name")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    email: user.email,
    name: profile?.name ?? (user.user_metadata?.name as string) ?? "",
    is_premium: profile?.is_premium ?? false,
    streak_count: 0,
    created_at: user.created_at,
  });
}
