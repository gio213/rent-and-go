import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

// Ensure this route is always dynamic (no caching)
export const dynamic = "force-dynamic";

// Idempotency tracking
const processedEvents = new Set<string>();

interface WebhookMetadata {
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  totalDays: string;
}

class WebhookError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = "WebhookError";
  }
}

// Utility function to safely parse metadata
function parseMetadata(
  metadata: Stripe.Metadata | null
): Partial<WebhookMetadata> {
  if (!metadata) return {};

  return {
    userId: metadata.userId || "",
    carId: metadata.carId || "",
    startDate: metadata.startDate || "",
    endDate: metadata.endDate || "",
    totalPrice: metadata.totalPrice || "",
    totalDays: metadata.totalDays || "",
  };
}

// Utility function to validate required metadata
function validateMetadata(metadata: Partial<WebhookMetadata>): WebhookMetadata {
  const required = [
    "userId",
    "carId",
    "startDate",
    "endDate",
    "totalPrice",
    "totalDays",
  ];
  const missing = required.filter(
    (key) => !metadata[key as keyof WebhookMetadata]
  );

  if (missing.length > 0) {
    throw new WebhookError(
      `Missing required metadata: ${missing.join(", ")}`,
      400
    );
  }

  return metadata as WebhookMetadata;
}

// Handler for payment_intent.succeeded
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log(`Processing payment_intent.succeeded: ${paymentIntent.id}`);

  try {
    // Try to get metadata from PaymentIntent first
    let metadata = parseMetadata(paymentIntent.metadata);
    let sessionId: string | null = null;

    // If metadata is incomplete, fetch from checkout session
    if (!metadata.startDate || !metadata.endDate) {
      console.log(
        "Metadata incomplete on PaymentIntent, fetching from checkout session..."
      );

      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      const session = sessions.data[0];
      if (!session) {
        throw new WebhookError(
          `No checkout session found for PaymentIntent: ${paymentIntent.id}`,
          404
        );
      }

      sessionId = session.id;
      const sessionMetadata = parseMetadata(session.metadata);

      // Merge metadata, preferring session data for missing fields
      metadata = { ...metadata, ...sessionMetadata };
      console.log("Retrieved metadata from session:", sessionMetadata);
    }

    // Validate that we have all required metadata
    const validatedMetadata = validateMetadata(metadata);

    // Parse dates
    const parsedStartDate = new Date(validatedMetadata.startDate);
    const parsedEndDate = new Date(validatedMetadata.endDate);

    // Validate dates
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new WebhookError("Invalid date format in metadata", 400);
    }

    if (parsedStartDate >= parsedEndDate) {
      throw new WebhookError("Start date must be before end date", 400);
    }

    // Parse numeric values
    const totalPrice = parseFloat(validatedMetadata.totalPrice);
    const durationDays = parseInt(validatedMetadata.totalDays);

    if (isNaN(totalPrice) || totalPrice <= 0) {
      throw new WebhookError("Invalid total price in metadata", 400);
    }

    if (isNaN(durationDays) || durationDays <= 0) {
      throw new WebhookError("Invalid duration days in metadata", 400);
    }

    // Use database transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Check for existing booking by session ID or payment intent ID
      const existingBooking = await tx.booking.findFirst({
        where: {
          OR: [
            { stripeSessionId: sessionId! },
            { stripePaymentIntentId: paymentIntent.id },
          ],
        },
      });

      if (existingBooking) {
        console.log(`Updating existing booking: ${existingBooking.id}`);

        return await tx.booking.update({
          where: { id: existingBooking.id },
          data: {
            paid: true,
            totalPrice,
            durationDays,
            status: "CONFIRMED",
            stripePaymentIntentId: paymentIntent.id,
            updatedAt: new Date(),
          },
        });
      } else {
        console.log("Creating new booking");

        // Verify user and car exist
        const [userExists, carExists] = await Promise.all([
          tx.user.findUnique({
            where: { id: validatedMetadata.userId },
            select: { id: true },
          }),
          tx.carForRent.findUnique({
            where: { id: validatedMetadata.carId },
            select: { id: true },
          }),
        ]);

        if (!userExists) {
          throw new WebhookError(
            `User not found: ${validatedMetadata.userId}`,
            404
          );
        }

        if (!carExists) {
          throw new WebhookError(
            `Car not found: ${validatedMetadata.carId}`,
            404
          );
        }

        return await tx.booking.create({
          data: {
            user: { connect: { id: validatedMetadata.userId } },
            car: { connect: { id: validatedMetadata.carId } },
            paid: true,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            durationDays,
            totalPrice,
            status: "CONFIRMED",
            stripeSessionId: sessionId!,
            stripePaymentIntentId: paymentIntent.id,
          },
        });
      }
    });

    console.log(`Successfully processed booking: ${result.id}`);
    return result;
  } catch (error) {
    console.error("Error in handlePaymentIntentSucceeded:", error);
    throw error;
  }
}

// Handler for payment_intent.payment_failed
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Processing payment_intent.payment_failed: ${paymentIntent.id}`);

  try {
    // Update any existing bookings to CANCELLED status
    const updatedBookings = await prisma.booking.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: { not: "CANCELLED" },
      },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    });

    console.log(
      `Cancelled ${updatedBookings.count} bookings for failed payment: ${paymentIntent.id}`
    );

    // Log the failure reason
    if (paymentIntent.last_payment_error) {
      console.error(
        `Payment failed reason: ${paymentIntent.last_payment_error.message}`
      );
    }
  } catch (error) {
    console.error("Error in handlePaymentIntentFailed:", error);
    throw error;
  }
}

// Handler for charge.succeeded
async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log(`Processing charge.succeeded: ${charge.id}`);

  try {
    if (!charge.payment_intent) {
      console.warn("Charge missing payment_intent");
      return;
    }

    // Always try to update with receipt URL, even if it's null
    // This ensures we don't miss updates
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (charge.receipt_url) {
      updateData.stripeReceiptUrl = charge.receipt_url;
      console.log(`Receipt URL available: ${charge.receipt_url}`);
    } else {
      console.warn("Receipt URL not yet available in charge object");

      // OPTION 2: Implement retry mechanism with exponential backoff
      setTimeout(async () => {
        try {
          const refreshedCharge = await stripe.charges.retrieve(charge.id);
          if (refreshedCharge.receipt_url) {
            await prisma.booking.updateMany({
              where: { stripePaymentIntentId: charge.payment_intent as string },
              data: {
                stripeReceiptUrl: refreshedCharge.receipt_url,
                updatedAt: new Date(),
              },
            });
            console.log(
              `Updated booking with delayed receipt URL: ${refreshedCharge.receipt_url}`
            );
          }
        } catch (error) {
          console.error("Error in delayed receipt URL update:", error);
        }
      }, 5000); // Retry after 5 seconds
    }

    const updatedBookings = await prisma.booking.updateMany({
      where: { stripePaymentIntentId: charge.payment_intent as string },
      data: updateData,
    });

    console.log(`Updated ${updatedBookings.count} bookings with charge data`);
  } catch (error) {
    console.error("Error in handleChargeSucceeded:", error);
    throw error;
  }
}

// Handler for checkout.session.completed
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log(`Processing checkout.session.completed: ${session.id}`);

  // This is mainly for logging and additional processing
  // The actual fulfillment should happen in payment_intent.succeeded

  try {
    // You could add additional logic here, such as:
    // - Sending confirmation emails
    // - Creating audit logs
    // - Updating user preferences

    console.log("Checkout session completed successfully");
  } catch (error) {
    console.error("Error in handleCheckoutSessionCompleted:", error);
    throw error;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Validate signature header
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      console.error("Missing Stripe signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get raw body for signature verification
    const body = await req.text();
    if (!body) {
      console.error("Empty request body");
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    // Construct and verify webhook event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Idempotency check
    if (processedEvents.has(event.id)) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log(`Processing webhook event: ${event.id}, type: ${event.type}`);

    // Process the event based on type
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "charge.succeeded":
          await handleChargeSucceeded(event.data.object as Stripe.Charge);
          break;

        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
          // Don't treat unhandled events as errors
          break;
      }

      // Mark event as processed
      processedEvents.add(event.id);

      // Clean up old processed events (keep last 1000)
      if (processedEvents.size > 1000) {
        const eventsArray = Array.from(processedEvents);
        eventsArray
          .slice(0, 100)
          .forEach((eventId) => processedEvents.delete(eventId));
      }

      const processingTime = Date.now() - startTime;
      console.log(
        `Successfully processed event ${event.id} in ${processingTime}ms`
      );

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      if (error instanceof WebhookError) {
        console.error(`Webhook business logic error: ${error.message}`);
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      // For unexpected errors, log and return 500 so Stripe will retry
      console.error("Unexpected error processing webhook:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fatal error in webhook handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
