"use server";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { get_current_user } from "./user.actions";
import type Stripe from "stripe";
import { getLocale } from "next-intl/server";

type CreateCheckoutResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function create_stripe_checkout_session(
  price: number,
  car: string,
  model: string,
  totalDays: number,
  carId: string
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

    // 3) თანხა ცენტებში (მთელი რიცხვი)
    const unitAmount = Math.round(Number(price) * 100);
    if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
      return { success: false, error: "INVALID_PRICE" };
    }

    // 4) სესიის შექმნა
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            // თუ დოლარზე ხარ, დატოვე "usd"; EU-ში ჯობს "eur"
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: `Booking for ${car} ${model}`,
              description: `Booking for ${car} ${model} for ${totalDays} days`,
              images: [`${env.NEXT_PUBLIC_BASE_URL}/${locale}/assets/logo.svg`],
            },
          },
          quantity: 1,
        },
      ],
      // metadata მხოლოდ სტრინგებს იღებს
      metadata: {
        carId: String(carId ?? ""),
        userId: String(user.id),
        totalDays: String(totalDays),
        car: String(car),
        model: String(model ?? ""),
      },
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/${locale}/my-bookings/`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/${locale}/car-detail/${carId}`,
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

    return { success: true, url: session.url };
  } catch (err: any) {
    console.error("Stripe session create error:", err);
    return { success: false, error: err?.message ?? "UNKNOWN_ERROR" };
  }
}
