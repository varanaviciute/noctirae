import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "noctiraeai@gmail.com";
const IS_MOCK = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_fake");

export async function POST(request: NextRequest) {
  const { name, email, question, userId } = await request.json();

  if (!name?.trim() || !email?.trim() || !question?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (IS_MOCK) {
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.emails.send({
      from: "Noctirae Support <onboarding@resend.dev>",
      to: SUPPORT_EMAIL,
      subject: `Support request from ${name}`,
      html: `
        <h2>New support request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User ID:</strong> ${userId ?? "not logged in"}</p>
        <hr />
        <p><strong>Question:</strong></p>
        <p>${question.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
