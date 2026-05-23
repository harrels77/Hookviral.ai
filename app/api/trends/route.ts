import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { googleTrends, youtubeTrends, redditPopular, rerankForNiche, computeVelocity, type TrendSource } from "@/lib/trends";

export async function GET(req: NextRequest) {
  const rl = await rateLimit(`trends:${getClientIp(req)}`, 60, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const sourceParam = req.nextUrl.searchParams.get("source");
  const source: TrendSource =
    sourceParam === "youtube" ? "youtube" :
    sourceParam === "reddit" ? "reddit" : "google";

  // "GLOBAL" is a pseudo-geo that fans Google fetches out across markets.
  // Real ISO codes stay 2 chars; we let GLOBAL pass through verbatim.
  const rawGeo = (req.nextUrl.searchParams.get("geo") || "US").toUpperCase();
  const geo = rawGeo === "GLOBAL" ? "GLOBAL" : rawGeo.slice(0, 2);
  const nicheSlug = req.nextUrl.searchParams.get("niche") || "";

  try {
    if (source === "youtube") {
      if (!process.env.YOUTUBE_API_KEY) {
        return NextResponse.json({ configured: false, source, trends: [] });
      }
      // YouTube doesn't support GLOBAL — degrade to US silently.
      const ytGeo = geo === "GLOBAL" ? "US" : geo;
      let trends = await youtubeTrends(nicheSlug, ytGeo);
      if (nicheSlug) trends = await rerankForNiche(nicheSlug, trends, "youtube", ytGeo);
      return NextResponse.json({ configured: true, source, trends });
    }

    if (source === "reddit") {
      // Reddit's geo_filter is a no-op from a server IP — we don't pass geo.
      const raw = await redditPopular();
      const { velocity, history } = await computeVelocity("reddit", "GLOBAL", raw);
      let trends = nicheSlug ? await rerankForNiche(nicheSlug, raw, "reddit", "GLOBAL") : raw;
      trends = trends.map(t => ({ ...t, velocity: velocity.get(t.title), history: history.get(t.title) }));
      return NextResponse.json({ configured: true, source, trends });
    }

    // Google. GLOBAL fans out across 6 geos and dedupes; specific geo is direct.
    const raw = await googleTrends(geo);
    const { velocity, history } = await computeVelocity("google", geo, raw);
    let trends = nicheSlug ? await rerankForNiche(nicheSlug, raw, "google", geo) : raw;
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
