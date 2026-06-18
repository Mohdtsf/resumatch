// ============================================================
// ResuMatch — Database Client (Neon Serverless)
// ============================================================

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Create a database client.
 * Uses Neon's serverless HTTP driver — no persistent connections needed.
 * Returns null if DATABASE_URL is not configured (graceful degradation).
 */
export function getDB() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes("user:pass@host")) {
    console.warn("[DB] DATABASE_URL not configured — database features disabled");
    return null;
  }

  try {
    const sql = neon(connectionString);
    return drizzle(sql, { schema });
  } catch (error) {
    console.error("[DB] Failed to connect:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}
