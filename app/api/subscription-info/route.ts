import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PREMIUM_PRICE_ID_MONTHLY, PREMIUM_PRICE_ID_YEARLY } from "@/lib/stripe";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.stripe_subscription_id) {
    return NextResponse.json({ plan: null });
  }

  const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
  const priceId = subscription.items.data[0]?.price.id;

  const plan = priceId === PREMIUM_PRICE_ID_YEARLY ? "yearly" : "monthly";

  return NextResponse.json({ plan, subscription_id: sub.stripe_subscription_id });
}
