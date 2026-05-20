import type { NextRequest } from "next/server";
import { upstashConfigured, pipeline } from "@/lib/upstash";

// Durable sliding-window limiter backed by Upstash Redis when configured.
// Falls back to best-effort in-memory (per-instance) when it isn't — so local
// dev and un-provisioned deploys still work, just without the hard guarantee.
const hits = new Map<string, number[]>();

export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < windowMs);
  if (recent.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    hits.set(key, recent);
    return { ok: false, retryAfter };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfter: 0 };
}

async function redisLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const rkey = `rl:${key}`;
  const member = `${now}:${Math.random().toString(36).slice(2)}`;
  const results = await pipeline([
    ["ZREMRANGEBYSCORE", rkey, 0, now - windowMs],
    ["ZADD", rkey, now, member],
    ["ZCARD", rkey],
    ["PEXPIRE", rkey, windowMs],
  ]);
  const count = Number(results[2] ?? 0);
  if (count > limit) {
    return { ok: false, retryAfter: Math.ceil(windowMs / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; retryAfter: number }> {
  if (upstashConfigured()) {
    try {
      return await redisLimit(key, limit, windowMs);
    } catch {
      // Redis hiccup — degrade to in-memory rather than failing the request.
      return memoryLimit(key, limit, windowMs);
    }
  }
  return memoryLimit(key, limit, windowMs);
}
