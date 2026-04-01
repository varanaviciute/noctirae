import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DREAM_MODEL = "gpt-4o-mini";

export function buildDreamPrompt(dreamText: string, isPremium: boolean, locale = "en"): string {
  const languageMap: Record<string, string> = {
    en: "English", lt: "Lithuanian", de: "German", fr: "French",
    es: "Spanish", pt: "Portuguese", it: "Italian", pl: "Polish",
    ru: "Russian", uk: "Ukrainian", zh: "Chinese", ja: "Japanese",
  };
  const language = languageMap[locale] ?? "English";

  const basePrompt = `You are a compassionate dream analyst combining modern psychology and ancient symbolism.
Analyze the following dream and respond in STRICT JSON format only. No markdown, no extra text.
IMPORTANT: Write ALL text values in ${language}.

Dream: "${dreamText}"

Respond with this exact JSON structure:
{
  "summary": "A short, empathetic rewrite of the dream in 2-3 sentences",
  "psychological": "Psychological interpretation using Jungian/modern frameworks. Max 100 characters.",
  "esoteric": "Esoteric and symbolic meaning drawing from universal symbolism and spiritual traditions. Max 100 characters.",
  "symbols": [
    { "symbol": "symbol name in ${language}", "meaning": "what it represents in this context" }
  ],
  "emotions": ["detected emotion 1", "detected emotion 2"],
  "themes": ["theme 1", "theme 2"]${isPremium ? `,
  "insights": "Pattern recognition and personal growth insights based on recurring symbols or emotions (2-3 sentences)",
  "reflections": ["Reflective question 1 for the dreamer", "Reflective question 2", "Reflective question 3"],
  "recommendations": ["Actionable suggestion 1", "Actionable suggestion 2", "Actionable suggestion 3"]` : ""}
}`;

  return basePrompt;
}
