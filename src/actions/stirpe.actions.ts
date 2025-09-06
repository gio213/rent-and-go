"use server";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { get_current_user } from "./user.actions";
import type Stripe from "stripe";
import { getLocale } from "next-intl/server";
import { BookCarFormDataDetailedType } from "@/validation/book-car-validation";
import { differenceInDays } from "date-fns";

type CreateCheckoutResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function create_stripe_checkout_session(
  stripe_session_data: BookCarFormDataDetailedType
): Promise<CreateCheckoutResult> {
  try {
    // 1) იუზერი უნდა იყოს ავტორიზებული
    const user = await get_current_user();
    const locale = await getLocale();

    if (!user?.id) {
      return { success: false, error: "NOT_AUTHENTICATED" };
    }

    // 2) აბსოლუტური URL-ები აუცილებელია
    if (!env.NEXT_PUBLIC_BASE_URL) {
      return { success: false, error: "BASE_URL_MISSING" };
    }

    if (!stripe_session_data) {
      return { success: false, error: "NO_SESSION_DATA" };
    }
    // 3 დღეების რაოდენობა
    const durationDays = differenceInDays(
      stripe_session_data.endDate,
      stripe_session_data.startDate
    );

    // 3 თანხის დათვლა დღეებზე
    const totalPrice = stripe_session_data.pricePerDay * durationDays;

    // 3) თანხა ცენტებში (მთელი რიცხვი)
    const unitAmount = Math.round(totalPrice * 100);
    if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
      return { success: false, error: "INVALID_PRICE" };
    }

    // 4) სესიის შექმნა
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      customer_creation: "always",

      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Booking for ${stripe_session_data.carName} ${stripe_session_data.carModel} for ${durationDays} days`,
          metadata: {
            carId: String(stripe_session_data.carId ?? ""),
            userId: String(user.id),
            totalDays: String(durationDays),
            car: String(stripe_session_data.carName),
            model: String(stripe_session_data.carModel ?? ""),
            startDate: String(stripe_session_data.startDate.toISOString()),
            endDate: String(stripe_session_data.endDate.toISOString()),
            totalPrice: String(totalPrice.toFixed(0)), // ანთწილადების მოშორება
          },
        },
      },

      line_items: [
        {
          price_data: {
            // თუ დოლარზე ხარ, დატოვე "usd"; EU-ში ჯობს "eur"
            currency: "usd",

            unit_amount: unitAmount,
            product_data: {
              name: `Booking for ${stripe_session_data.carName} ${stripe_session_data.carModel}`,
              description: `Booking for ${stripe_session_data.carName} ${stripe_session_data.carModel} for ${durationDays} days`,
              images: [`${stripe_session_data.carImage}`],
            },
          },

          quantity: 1,
        },
      ],
      // metadata მხოლოდ სტრინგებს იღებს
      metadata: {
        carId: String(stripe_session_data.carId ?? ""),
        userId: String(user.id),
        totalDays: String(durationDays),
        car: String(stripe_session_data.carName),
        model: String(stripe_session_data.carModel ?? ""),
        startDate: String(stripe_session_data.startDate.toISOString()),
        endDate: String(stripe_session_data.endDate.toISOString()),
        totalPrice: String(totalPrice.toFixed(0)), // ანთწილადების მოშორება
      },
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/${locale}/my-bookings/success/${stripe_session_data.carId}`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/${locale}/car-detail/${stripe_session_data.carId}`,
      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read Rent and Drives [Terms of Service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to the terms and conditions.`,
        },
      },
      consent_collection: { terms_of_service: "required" },
    } satisfies Stripe.Checkout.SessionCreateParams);

    if (!session.url) {
      return { success: false, error: "NO_SESSION_URL" };
    }

    // console.log("Session created successfully:", stripe_session_data);

    return { success: true, url: session.url };
  } catch (err: any) {
    console.error("Stripe session create error:", err);
    return { success: false, error: err?.message ?? "UNKNOWN_ERROR" };
  }
}
