import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  // Delete user data (profile cascade deletes on auth user side)
  await supabase.from("weekly_insights").delete().eq("user_id", user.id);
  await supabase.from("dreams").delete().eq("user_id", user.id);
  await supabase.from("profiles").delete().eq("id", user.id);

  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  response.cookies.set("locale", "", { maxAge: 0, path: "/" });
  return response;
}
