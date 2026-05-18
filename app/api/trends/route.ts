import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getNiche } from "@/lib/niches";

// Coarse niche -> YouTube videoCategoryId. Unmapped niches fall back to
// general trending (no category filter).
const NICHE_CATEGORY: Record<string, string> = {
  football: "17", // Sports
  fitness: "17",
  tech: "28", // Science & Technology
  "ai-content": "28",
  finance: "25", // News & Politics
  business: "22", // People & Blogs
  motivation: "22",
  faceless: "24", // Entertainment
};

const CACHE_SECONDS = 21600; // 6h — protects quotas / endpoints

interface Trend { title: string; sub: string; }

function cdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

// Google Trends "Trending Now" RSS. No API key, no scraping lib. Undocumented
// but stable public endpoint — we degrade gracefully if it changes.
async function googleTrends(geo: string): Promise<Trend[]> {
  const res = await fetch(
    `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`,
    { next: { revalidate: CACHE_SECONDS } }
  );
  if (!res.ok) throw new Error(`google trends ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items
    .map(block => {
      const title = cdata((block.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1]);
      const traffic = cdata(
        (block.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/) || [, ""])[1]
      );
      const news = cdata(
        (block.match(/<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/) || [, ""])[1]
      );
      return { title, sub: traffic ? `${traffic} searches` : news };
    })
    .filter(t => t.title.length > 0)
    .slice(0, 12);
}

interface YouTubeItem { snippet?: { title?: string; channelTitle?: string }; }

async function youtubeTrends(nicheSlug: string): Promise<Trend[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("missing-key");
  const niche = getNiche(nicheSlug);
  const categoryId = niche ? NICHE_CATEGORY[niche.slug] : undefined;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("regionCode", "US");
  url.searchParams.set("maxResults", "15");
  if (categoryId) url.searchParams.set("videoCategoryId", categoryId);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate: CACHE_SECONDS } });
  if (!res.ok) throw new Error(`youtube ${res.status}`);
  const data = (await res.json()) as { items?: YouTubeItem[] };
  return (data.items || [])
    .map(it => ({
      title: it.snippet?.title?.trim() || "",
      sub: it.snippet?.channelTitle?.trim() || "",
    }))
    .filter(t => t.title.length > 0)
    .slice(0, 12);
}

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
      const trends = await youtubeTrends(req.nextUrl.searchParams.get("niche") || "");
      return NextResponse.json({ configured: true, source, trends });
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
