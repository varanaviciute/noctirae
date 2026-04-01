import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/chat";

  if (code) {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Create profile if it doesn't exist yet
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name ?? "",
          language: user.user_metadata?.language ?? "en",
          is_premium: false,
        });
      }

      const language = (user.user_metadata?.language as string) ?? "en";
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set("locale", language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
