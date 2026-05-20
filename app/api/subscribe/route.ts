import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { upstashConfigured, command } from "@/lib/upstash";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`subscribe:${getClientIp(req)}`, 10, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { email, source } = await req.json();
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }

    if (!upstashConfigured()) {
      // Don't fake success — surface that capture isn't wired yet.
      return NextResponse.json(
        { error: "Email capture is not configured yet." },
        { status: 503 }
      );
    }

    const clean = email.trim().toLowerCase();
    const tag = typeof source === "string" ? source.slice(0, 40) : "site";
    // Set = dedupe; hash = first-seen timestamp + entry source for context.
    await command(["SADD", "hv:subscribers", clean]);
    await command([
      "HSET",
      "hv:subscriber_meta",
      clean,
      JSON.stringify({ at: new Date().toISOString(), source: tag }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
  }
}
