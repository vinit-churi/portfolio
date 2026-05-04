import { LRUCache } from "lru-cache";

type Bucket = { count: number; reset: number };

const cache = new LRUCache<string, Bucket>({ max: 1000 });

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetMs: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const bucket = cache.get(key);
  if (!bucket || bucket.reset < now) {
    cache.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetMs: bucket.reset - now };
  }
  bucket.count++;
  cache.set(key, bucket);
  return { allowed: true, remaining: limit - bucket.count, resetMs: bucket.reset - now };
}

export function ipFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
