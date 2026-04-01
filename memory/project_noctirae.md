---
name: Project Noctirae
description: AI sapnų interpretacijos web app — Next.js 14, OpenAI, Stripe, Supabase (mock mode)
type: project
---

**Noctirae** — AI sapnų interpretacijos web aplikacija.

**Tech stack:**
- Next.js 14.2 (App Router) + TypeScript + Tailwind CSS
- OpenAI API (`gpt-4o-mini`) sapnų aiškinimui (psichologinis + ezoterinis, max 100 simbolių kiekvienas)
- Stripe premium prenumeratai (€5.99/mėn arba €49.99/metams, 3 dienų trial)
- Supabase sukonfigūruota, bet kol kas naudojamas mock auth (cookie-based, `.mock-dreams.json`)
- Resend el. paštui

**Pagrindinės funkcijos:**
- Sapnų interpretacija (tekstas arba balsas), max 500 žodžių
- Free tier: 1 sapnas per dieną
- Sapnų žurnalas (premium)
- Įžvalgų/patterns analizė (premium)
- Savaitinės ilgalaikės įžvalgos (generuojamos per OpenAI, max 1x per dieną rankiniu būdu)
- 12 kalbų palaikymas (en, lt, de, fr, es, pt, it, pl, ru, uk, zh, ja)

**i18n sistema:**
- Vertimų failai: `/locales/*.ts`
- Client komponentai: `useT()` hook iš `LocaleProvider`
- Server komponentai: `loadTranslations(locale)` iš `lib/i18n.ts`
- Kalba išsaugoma `localStorage` + `locale` cookie
- OpenAI promptas atsakinėja pasirinkta kalba

**Kontaktai:**
- Support el. paštas: noctiraeai@gmail.com

**Architektūra:**
- `/app/(app)/chat` — pagrindinis sapnų įvedimo UI
- `/app/(app)/journal` — sapnų istorija
- `/app/(app)/insights` — patterns analizė
- `/app/api/interpret` — OpenAI interpretacija su gpt-4o-mini
- `/app/api/insights/generate` — savaitinių įžvalgų generavimas
- `/lib/openai.ts` — OpenAI klientas, DREAM_MODEL, buildDreamPrompt
- `/lib/mock-auth.ts` + `/lib/mock-store.ts` — mock auth/storage
- `/lib/i18n.ts` — vertimų įkėlimas server pusėje
- `/components/layout/LocaleProvider.tsx` — i18n kontekstas client pusėje

**Hostingas:**
- Planuojama Vercel (ne Hostinger — Next.js App Router reikalauja Node.js proceso)
- Prieš deployinant reikia: realaus Supabase auth + DB (pakeisti mock), realių Stripe price ID

**Why:** Projektas demo-ready su production infrastruktūra, bet mock layer leidžia dirbti be realių servisų.
