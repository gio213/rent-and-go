import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(1),
    DATABASE_URL: z.url({
      message: "Invalid DATABASE_URL format. Ensure it is a valid URL.",
    }),
    BLOB_READ_WRITE_TOKEN: z.string().min(1, {
      message: "BLOB_READ_WRITE_TOKEN is required",
    }),
    STRIPE_PUBLISHABLE_KEY: z.string().min(1, {
      message: "STRIPE_PUBLISHABLE_KEY is required",
    }),
    STRIPE_SECRET_KEY: z.string().min(1, {
      message: "STRIPE_SECRET_KEY is required",
    }),
    STRIPE_WEBHOOK_SECRET: z.string().min(1, {
      message: "STRIPE_WEBHOOK_SECRET is required",
    }),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url().min(1, {
      message: "NEXT_PUBLIC_BASE_URL is required",
    }),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
