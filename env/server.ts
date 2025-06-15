import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    REDIS_URL: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
