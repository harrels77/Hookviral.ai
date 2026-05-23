import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { googleTrends, youtubeTrends, redditPopular, rerankForNiche, computeVelocity, type Trend, type TrendSource } from "@/lib/trends";

function parseSources(csv: string | null): TrendSource[] {
  if (!csv) return ["google"];
  const parts = csv.split(",").map(s => s.trim()).filter(Boolean);
  const valid = parts.filter((s): s is TrendSource =>
    s === "google" || s === "youtube" || s === "reddit"
  );
  // De-dupe in case "?sources=google,google" sneaks in.
  return Array.from(new Set(valid.length > 0 ? valid : ["google"]));
}

export async function GET(req: NextRequest) {
  const rl = await rateLimit(`trends:${getClientIp(req)}`, 60, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // Multi-source: any combination of google / youtube / reddit. Fallback to
  // ?source= (singular) for any old client that still uses it.
  const sourcesParam = req.nextUrl.searchParams.get("sources")
    || req.nextUrl.searchParams.get("source");
  const sources = parseSources(sourcesParam);

  // "GLOBAL" is a pseudo-geo that fans Google fetches out across markets.
  // Real ISO codes stay 2 chars; we let GLOBAL pass through verbatim.
  const rawGeo = (req.nextUrl.searchParams.get("geo") || "US").toUpperCase();
  const geo = rawGeo === "GLOBAL" ? "GLOBAL" : rawGeo.slice(0, 2);
  const nicheSlug = req.nextUrl.searchParams.get("niche") || "";

  // Fan out fetches in parallel. Each result carries its own "configured"
  // flag — YouTube without YOUTUBE_API_KEY returns trends=[] + configured=false
  // so the UI can show the env-var hint only for the sources that need it,
  // without killing the rest of the response.
  type SourceResult = { source: TrendSource; trends: Trend[]; configured: boolean };
  const fetches: Promise<SourceResult>[] = sources.map(async (s): Promise<SourceResult> => {
    try {
      if (s === "youtube") {
        if (!process.env.YOUTUBE_API_KEY) {
          return { source: s, trends: [], configured: false };
        }
        const ytGeo = geo === "GLOBAL" ? "US" : geo;
        const raw = await youtubeTrends(nicheSlug, ytGeo);
        return { source: s, trends: raw.map(t => ({ ...t, source: s })), configured: true };
      }
      if (s === "reddit") {
        const raw = await redditPopular();
        return { source: s, trends: raw.map(t => ({ ...t, source: s })), configured: true };
      }
      // google
      const raw = await googleTrends(geo);
      return { source: s, trends: raw.map(t => ({ ...t, source: s })), configured: true };
    } catch (err) {
      console.error(`trends ${s} failed`, err);
      return { source: s, trends: [], configured: true };
    }
  });

  const results = await Promise.all(fetches);

  // Velocity per source, also in parallel. Each source has its own
  // (source, geo) snapshot bucket in Redis; we don't want to mix Google
  // ranks with YouTube ranks.
  await Promise.all(results.map(async r => {
    if (r.trends.length === 0) return;
    const sourceGeo = r.source === "reddit" ? "GLOBAL" : geo;
    const { velocity, history } = await computeVelocity(r.source, sourceGeo, r.trends);
    r.trends = r.trends.map(t => ({
      ...t,
      velocity: velocity.get(t.title),
      history: history.get(t.title),
    }));
  }));

  // Merge round-robin so no single source dominates the top of the grid.
  // Dedupe by lowercased title — when the same story trends across multiple
  // sources, first seen wins (which preserves the rank within its source).
  const seen = new Set<string>();
  const merged: Trend[] = [];
  const maxLen = Math.max(0, ...results.map(r => r.trends.length));
  for (let i = 0; i < maxLen; i++) {
    for (const r of results) {
      const t = r.trends[i];
      if (!t) continue;
      const key = t.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(t);
    }
  }

  // Niche rerank on the full merged list. Cache tag includes every axis
  // that changes the input — sorted sources + geo + (nicheSlug is in the
  // key inside rerankForNiche). Sorting prevents "google,youtube" and
  // "youtube,google" from looking different to the cache.
  const cacheTag = `${[...sources].sort().join("+")}:${geo}`;
  const final = nicheSlug ? await rerankForNiche(nicheSlug, merged, cacheTag) : merged;

  // Per-source configured map → UI shows the YouTube env-var nudge only if
  // YouTube was actually selected and isn't configured.
  const unconfigured: TrendSource[] = results
    .filter(r => !r.configured)
    .map(r => r.source);

  // Did EVERYTHING come back empty? Tell the client so it can render an
  // honest "no trends" instead of an empty grid.
  const allEmpty = results.every(r => r.trends.length === 0);

  return NextResponse.json({
    trends: final,
    sources,
    unconfigured,
    error: allEmpty && unconfigured.length === sources.length
      ? "No sources configured — add YOUTUBE_API_KEY to .env to enable YouTube."
      : "",
  });
}
