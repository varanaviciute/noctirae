import { NextRequest, NextResponse } from "next/server";

const IS_MOCK = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-fake-key";

export async function POST(request: NextRequest) {
  if (IS_MOCK) {
    return NextResponse.json({ text: "Voice transcription requires an OpenAI API key." });
  }

  try {
    const { openai } = await import("@/lib/openai");
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
