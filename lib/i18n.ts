import en, { Translations } from "@/locales/en";

const localeMap: Record<string, () => Promise<{ default: Translations }>> = {
  en: () => import("@/locales/en"),
  lt: () => import("@/locales/lt"),
  de: () => import("@/locales/de"),
  fr: () => import("@/locales/fr"),
  es: () => import("@/locales/es"),
  pt: () => import("@/locales/pt"),
  it: () => import("@/locales/it"),
  pl: () => import("@/locales/pl"),
  ru: () => import("@/locales/ru"),
  uk: () => import("@/locales/uk"),
  zh: () => import("@/locales/zh"),
  ja: () => import("@/locales/ja"),
};

export async function loadTranslations(locale: string): Promise<Translations> {
  const loader = localeMap[locale] ?? localeMap["en"];
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return en;
  }
}

export function getLocaleFromCookie(cookieHeader: string | null): string {
  if (!cookieHeader) return "en";
  const match = cookieHeader.match(/locale=([^;]+)/);
  return match?.[1] ?? "en";
}
