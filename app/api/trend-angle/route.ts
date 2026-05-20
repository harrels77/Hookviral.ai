import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { decodeTrend } from "@/lib/trends";

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`trend-angle:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { trend, niche } = await req.json();
    if (!trend || typeof trend !== "string" || !trend.trim()) {
      return NextResponse.json({ error: "Missing trend." }, { status: 400 });
    }

    const decoded = await decodeTrend(
      trend.trim(),
      typeof niche === "string" ? niche : ""
    );
    return NextResponse.json({ decoded });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not decode this trend." }, { status: 500 });
  }
}
