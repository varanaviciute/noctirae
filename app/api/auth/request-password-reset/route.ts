import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: "https://noctirae.com/auth/reset-callback" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const resetLink = data.properties?.action_link;
  if (!resetLink) return NextResponse.json({ error: "Failed to generate link" }, { status: 500 });

  await resend.emails.send({
    from: "Noctirae <noreply@noctirae.com>",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password.</p>
        <p style="text-align:center;margin:32px 0;">
          <a href="${resetLink}" style="background:#7c3aed;color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;display:inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color:#999;font-size:12px;">Or copy this link:<br/>${resetLink}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
