import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    JWT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),
    NEXT_PUBLIC_STRIPE_ULTIMATE_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_POWER_SELLER_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_POPULAR_CHOICE_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_SMALL_BUNDLE_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_STARTER_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_BUNDLE_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_STRIPE_ULTIMATE_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PLAN_ID,
    NEXT_PUBLIC_STRIPE_POWER_SELLER_ID:
      process.env.NEXT_PUBLIC_STRIPE_POWER_SELLER_ID,
    NEXT_PUBLIC_STRIPE_POPULAR_CHOICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_POPULAR_CHOICE_ID,
    NEXT_PUBLIC_STRIPE_SMALL_BUNDLE_ID:
      process.env.NEXT_PUBLIC_STRIPE_SMALL_BUNDLE_ID,
    NEXT_PUBLIC_STRIPE_STARTER_ID: process.env.NEXT_PUBLIC_STRIPE_STARTER_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRO_BUNDLE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_BUNDLE_ID,
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  },
});
