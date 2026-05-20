import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { googleTrends, youtubeTrends, rerankForNiche, computeVelocity } from "@/lib/trends";

export async function GET(req: NextRequest) {
  const rl = await rateLimit(`trends:${getClientIp(req)}`, 60, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const source = req.nextUrl.searchParams.get("source") === "youtube" ? "youtube" : "google";

  const geo = (req.nextUrl.searchParams.get("geo") || "US").toUpperCase().slice(0, 2);

  try {
    if (source === "youtube") {
      if (!process.env.YOUTUBE_API_KEY) {
        return NextResponse.json({ configured: false, source, trends: [] });
      }
      const nicheSlug = req.nextUrl.searchParams.get("niche") || "";
      let trends = await youtubeTrends(nicheSlug, geo);
      if (nicheSlug) trends = await rerankForNiche(nicheSlug, trends);
      return NextResponse.json({ configured: true, source, trends: trends.slice(0, 12) });
    }
    const nicheSlug = req.nextUrl.searchParams.get("niche") || "";
    const raw = await googleTrends(geo);
    // Velocity + rank history measured on the true search order, before niche filter.
    const { velocity, history } = await computeVelocity("google", geo, raw);
    // Google trends aren't category-filterable — let Claude keep only the ones
    // a creator in this niche could realistically build a video around.
    let trends = nicheSlug ? await rerankForNiche(nicheSlug, raw, "google") : raw;
    trends = trends.map(t => ({ ...t, velocity: velocity.get(t.title), history: history.get(t.title) }));
    return NextResponse.json({ configured: true, source, trends });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { configured: true, source, trends: [], error: "Could not load trends right now." },
      { status: 502 }
    );
  }
}
