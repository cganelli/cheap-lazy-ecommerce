/**
 * Rate limiter utility for API routes
 * 
 * Location: src/lib/rateLimiter.ts
 * Purpose: Simple in-memory rate limiting with sliding window algorithm
 */

// In-memory store: Map<key, timestamps[]>
// Key format: "route:identifier"
const requestTimestamps = new Map<string, number[]>();

/**
 * Default rate limit configuration
 */
const DEFAULT_WINDOW_MS = 60_000; // 60 seconds
const DEFAULT_MAX_REQUESTS = 20; // 20 requests per window

/**
 * Checks if a request is allowed based on rate limiting
 * 
 * @param options - Rate limit options
 * @param options.route - The API route name (e.g., 'admin/import', 'admin/bulk')
 * @param options.identifier - Unique identifier for the client (IP, key prefix, etc.)
 * @param options.windowMs - Time window in milliseconds (default: 60000)
 * @param options.maxRequests - Maximum requests allowed in the window (default: 20)
 * @returns Object with allowed status and optional retryAfterMs
 */
export function checkRateLimit(options: {
  route: string;
  identifier: string;
  windowMs?: number;
  maxRequests?: number;
}): { allowed: boolean; retryAfterMs?: number } {
  const {
    route,
    identifier,
    windowMs = DEFAULT_WINDOW_MS,
    maxRequests = DEFAULT_MAX_REQUESTS,
  } = options;

  const key = `${route}:${identifier || 'anonymous'}`;
  const now = Date.now();

  // Get existing timestamps or initialize empty array
  const existingTimestamps = requestTimestamps.get(key) || [];

  // Filter timestamps to only include those within the current window
  const recentTimestamps = existingTimestamps.filter(
    (ts) => now - ts < windowMs
  );

  // Check if limit is exceeded
  if (recentTimestamps.length >= maxRequests) {
    // Calculate retry after time (time until oldest request expires)
    const oldestTimestamp = Math.min(...recentTimestamps);
    const retryAfterMs = windowMs - (now - oldestTimestamp);

    // Update the map with filtered timestamps (don't add new one)
    requestTimestamps.set(key, recentTimestamps);

    return {
      allowed: false,
      retryAfterMs: Math.max(0, retryAfterMs),
    };
  }

  // Under the limit - add current timestamp
  recentTimestamps.push(now);
  requestTimestamps.set(key, recentTimestamps);

  return { allowed: true };
}

/**
 * Derives a safe identifier from request headers
 * 
 * Priority:
 * 1. IP address from x-forwarded-for header (first value)
 * 2. Safe prefix from x-site-key header (first 4 chars only)
 * 3. 'unknown' if neither exists
 * 
 * @param headers - Request headers
 * @param route - The API route name (for logging context)
 * @returns Safe identifier string
 */
export function deriveIdentifier(headers: Headers, route: string): string {
  // Try to get IP from x-forwarded-for (common in proxies/load balancers)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP address (before comma if multiple)
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  // Fallback: use safe prefix from x-site-key (never log full key)
  const siteKey = headers.get('x-site-key') || headers.get('X-Site-Key') || headers.get('x-Site-Key');
  if (siteKey && siteKey.length >= 4) {
    // Use first 4 characters only for identification
    return `key-${siteKey.slice(0, 4)}`;
  }

  // Last resort: unknown identifier
  return 'unknown';
}

