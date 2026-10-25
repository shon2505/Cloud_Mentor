/**
 * In-memory sliding-window rate limiter per client IP.
 * Defaults to 20 requests per 60 seconds (1 minute).
 */
interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 req/min

/**
 * Checks whether an IP has exceeded the allowed request limit.
 * Cleans up timestamps older than WINDOW_MS.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const record = ipRequestMap.get(ip) || { timestamps: [] };

  // Filter out timestamps outside the active window
  const activeTimestamps = record.timestamps.filter((t) => t > windowStart);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const resetInMs = Math.max(0, oldest + WINDOW_MS - now);
    return {
      allowed: false,
      remaining: 0,
      resetInMs,
    };
  }

  // Record this request
  activeTimestamps.push(now);
  ipRequestMap.set(ip, { timestamps: activeTimestamps });

  // Periodically clean up stale IPs (keep map size reasonable)
  if (ipRequestMap.size > 2000) {
    ipRequestMap.forEach((val, key) => {
      const recent = val.timestamps.filter((t) => t > windowStart);
      if (recent.length === 0) {
        ipRequestMap.delete(key);
      } else {
        ipRequestMap.set(key, { timestamps: recent });
      }
    });
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - activeTimestamps.length,
    resetInMs: WINDOW_MS,
  };
}
