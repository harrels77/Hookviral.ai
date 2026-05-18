import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { googleTrends, youtubeTrends, rerankForNiche } from "@/lib/trends";

export async function GET(req: NextRequest) {
  const rl = rateLimit(`trends:${getClientIp(req)}`, 60, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const source = req.nextUrl.searchParams.get("source") === "youtube" ? "youtube" : "google";

  try {
    if (source === "youtube") {
      if (!process.env.YOUTUBE_API_KEY) {
        return NextResponse.json({ configured: false, source, trends: [] });
      }
      const nicheSlug = req.nextUrl.searchParams.get("niche") || "";
      let trends = await youtubeTrends(nicheSlug);
      if (nicheSlug) trends = await rerankForNiche(nicheSlug, trends);
      return NextResponse.json({ configured: true, source, trends: trends.slice(0, 12) });
    }
    const geo = req.nextUrl.searchParams.get("geo") || "US";
    const trends = await googleTrends(geo);
    return NextResponse.json({ configured: true, source, trends });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { configured: true, source, trends: [], error: "Could not load trends right now." },
      { status: 502 }
    );
  }
}
