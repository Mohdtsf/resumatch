// ============================================================
// ResuMatch — Rate Limiter (Upstash Redis)
// ============================================================

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only create rate limiter if Upstash credentials are configured
let ratelimit: Ratelimit | null = null;

function getRateLimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("[Rate Limiter] Upstash credentials not configured — rate limiting disabled");
    return null;
  }

  try {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      // 5 analyses per 10 minutes per IP
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: false,
      prefix: "resumatch:ratelimit",
    });
    return ratelimit;
  } catch {
    console.warn("[Rate Limiter] Failed to initialize — rate limiting disabled");
    return null;
  }
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check rate limit for a given identifier (typically IP address).
 * Returns allowed: true if Upstash is not configured (graceful degradation).
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getRateLimiter();

  if (!limiter) {
    return {
      allowed: true,
      remaining: 999,
      resetAt: new Date(Date.now() + 600000),
    };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: new Date(result.reset),
    };
  } catch {
    // If Redis is down, allow the request (fail open for availability)
    console.error("[Rate Limiter] Redis error — allowing request");
    return {
      allowed: true,
      remaining: 999,
      resetAt: new Date(Date.now() + 600000),
    };
  }
}
