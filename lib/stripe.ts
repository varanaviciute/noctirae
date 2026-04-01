import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as const,
});

export const PREMIUM_PRICE_ID_MONTHLY = process.env.STRIPE_PREMIUM_PRICE_ID_MONTHLY!;
export const PREMIUM_PRICE_ID_YEARLY = process.env.STRIPE_PREMIUM_PRICE_ID_YEARLY!;
