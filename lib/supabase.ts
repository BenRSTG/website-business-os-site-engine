import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/** Der einzige Datenbankzugang des site-engine: der öffentliche Schlüssel, geschützt durch Row-Level-Security. */
export function createAnonClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
