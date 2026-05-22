import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { strategicTakes } from "@/lib/takes";

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`strategic-takes:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { subject, niche } = await req.json();
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json({ error: "Missing subject." }, { status: 400 });
    }

    const takes = await strategicTakes(
      subject.trim(),
      typeof niche === "string" ? niche : ""
    );
    return NextResponse.json({ takes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not compute strategic takes for this subject." },
      { status: 500 }
    );
  }
}
