import "server-only";
import { z } from "zod";

// Einziger Supabase-Zugang im site-engine: der anon key, nie der Service-Role-Key
// (docs/02-architekturentscheidung.md §9). Nur serverseitig lesbar (kein NEXT_PUBLIC_).
const envSchema = z.object({
  SUPABASE_URL: z
    .url()
    .refine((v) => !v.includes("/rest/v1"), {
      message: "Basis-URL ohne /rest/v1/ angeben",
    }),
  SUPABASE_ANON_KEY: z.string().min(20),
});

export const env = envSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
});
