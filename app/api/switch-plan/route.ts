import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PREMIUM_PRICE_ID_MONTHLY, PREMIUM_PRICE_ID_YEARLY } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await request.json();
  if (plan !== "monthly" && plan !== "yearly") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.stripe_subscription_id) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
  const itemId = subscription.items.data[0]?.id;
  const newPriceId = plan === "yearly" ? PREMIUM_PRICE_ID_YEARLY : PREMIUM_PRICE_ID_MONTHLY;

  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    items: [{ id: itemId, price: newPriceId }],
    proration_behavior: "create_prorations",
  });

  return NextResponse.json({ success: true });
}
