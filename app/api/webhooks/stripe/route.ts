import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Use service role for webhook handler (bypasses RLS)
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const supabase = getAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const subscriptionId = session.subscription as string;

      console.log("[webhook] checkout.session.completed", { userId, subscriptionId, customer: session.customer });

      if (!userId || !subscriptionId) {
        console.error("[webhook] missing userId or subscriptionId", { metadata: session.metadata });
        break;
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const { error: subError } = await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        status: subscription.status,
        current_period_end: new Date(((subscription as any).current_period_end ?? 0) * 1000).toISOString(),
      });
      if (subError) console.error("[webhook] subscriptions upsert error", subError);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_premium: true, stripe_customer_id: session.customer as string })
        .eq("id", userId);
      if (profileError) console.error("[webhook] profiles update error", profileError);
      else console.log("[webhook] profile updated to premium for user", userId);
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const isActive = subscription.status === "active" || subscription.status === "trialing";

      await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(((subscription as any).current_period_end ?? 0) * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      // Update premium status
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (sub?.user_id) {
        await supabase
          .from("profiles")
          .update({ is_premium: isActive })
          .eq("id", sub.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
