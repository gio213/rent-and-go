import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// ❗ Put this in your env and ROTATE the secret you pasted above

const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

// Ensure this route is always dynamic (no caching)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  // You MUST pass the raw body string to constructEvent
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // (Optional) Idempotency guard if your handler isn’t idempotent:
  // e.g., check event.id in your DB before processing

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // Fulfill your order here
        // e.g., await markOrderPaid(pi.metadata.orderId, pi.id);
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // Notify customer / mark as failed
        // e.g., await markOrderFailed(pi.metadata.orderId, pi.last_payment_error?.message);
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Useful for logging, fetching line items, or attaching customer details
        // BUT still do fulfillment on payment_intent.succeeded
        // const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        break;
      }
      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }
  } catch (err: any) {
    // If your business logic fails, respond 500 so Stripe can retry
    console.error("Handler error:", err);
    return new Response("Webhook handler error", { status: 500 });
  }

  // Acknowledge receipt
  return new Response(null, { status: 200 });
}
