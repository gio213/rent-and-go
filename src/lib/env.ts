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
  },
  client: {},
  experimental__runtimeEnv: {},
});
