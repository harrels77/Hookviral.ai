import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getNiche } from "@/lib/niches";

// Coarse niche -> YouTube videoCategoryId. Unmapped niches fall back to
// general trending (no category filter).
const NICHE_CATEGORY: Record<string, string> = {
  football: "17", // Sports
  fitness: "17", // Sports
  tech: "28", // Science & Technology
  "ai-content": "28",
  finance: "25", // News & Politics (closest for money/markets)
  business: "22", // People & Blogs
  motivation: "22",
  faceless: "24", // Entertainment
};

const CACHE_SECONDS = 21600; // 6h — protects the YouTube quota

interface YouTubeItem {
  snippet?: { title?: string; channelTitle?: string };
}

export async function GET(req: NextRequest) {
  const rl = rateLimit(`trends:${getClientIp(req)}`, 60, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json({ configured: false, trends: [] });
  }

  const nicheSlug = req.nextUrl.searchParams.get("niche") || "";
  const niche = getNiche(nicheSlug);
  const categoryId = niche ? NICHE_CATEGORY[niche.slug] : undefined;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("regionCode", "US");
  url.searchParams.set("maxResults", "15");
  if (categoryId) url.searchParams.set("videoCategoryId", categoryId);
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: CACHE_SECONDS },
    });
    if (!res.ok) {
      return NextResponse.json(
        { configured: true, trends: [], error: "Could not load trends right now." },
        { status: 502 }
      );
    }
    const data = (await res.json()) as { items?: YouTubeItem[] };
    const trends = (data.items || [])
      .map(it => ({
        title: it.snippet?.title?.trim() || "",
        channel: it.snippet?.channelTitle?.trim() || "",
      }))
      .filter(t => t.title.length > 0)
      .slice(0, 12);

    return NextResponse.json({ configured: true, niche: niche?.slug || null, trends });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { configured: true, trends: [], error: "Could not load trends right now." },
      { status: 502 }
    );
  }
}
