import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// ❗ Put this in your env and ROTATE the secret you pasted above

const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

// Ensure this route is always dynamic (no caching)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  console.log("sig", sig);
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

  console.log("stripe event id:", event.id, "type:", event.type);

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // Fulfill your order here
        // e.g., await markOrderPaid(pi.metadata.orderId, pi.id);

        // convert start date and end date from metadata to Date object

        // try PI metadata first
        let startDate = pi.metadata?.startDate;
        let endDate = pi.metadata?.endDate;

        // fallback: find the checkout session that created this PaymentIntent
        if (!startDate || !endDate) {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: pi.id,
            limit: 1,
          });
          const session = sessions.data[0];
          startDate = startDate || session?.metadata?.startDate!;
          endDate = endDate || session?.metadata?.endDate!;
          console.log("found session metadata", session?.metadata);
          console.log("endDate from webhook", endDate);
          // Try to avoid duplicate bookings: if a booking already exists for
          // the same user/car/start/end, update it to CONFIRMED instead of creating a new one.
          const userId = session?.metadata?.userId!;
          const carId = session?.metadata?.carId!;
          const parsedStart = new Date(startDate);
          const parsedEnd = new Date(endDate);

          const existing = await prisma.booking.findFirst({
            where: {
              userId,
              carId,
              startDate: parsedStart,
              endDate: parsedEnd,
            },
          });

          if (existing) {
            console.log(
              "Found existing booking, updating to CONFIRMED",
              existing.id
            );
            await prisma.booking.update({
              where: { id: existing.id },
              data: {
                paid: true,
                totalPrice: parseFloat(session?.metadata?.totalPrice!),
                durationDays: parseInt(session?.metadata?.totalDays!),
                status: "CONFIRMED",
              },
            });
          } else {
            await prisma.booking.create({
              data: {
                user: { connect: { id: userId } },
                car: { connect: { id: carId } },
                paid: true,
                startDate: parsedStart,
                endDate: parsedEnd,
                durationDays: parseInt(session?.metadata?.totalDays!),
                totalPrice: parseFloat(session?.metadata?.totalPrice!),
                status: "CONFIRMED",
              },
            });
          }
        }

        console.log("startDate from webhook", startDate);
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
        console.log("session", session);
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
