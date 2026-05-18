import Anthropic from "@anthropic-ai/sdk";
import { getNiche } from "@/lib/niches";

export interface Trend { title: string; sub: string; }
export type TrendSource = "google" | "youtube";

export const TREND_CACHE_SECONDS = 21600; // 6h — protects quotas / endpoints

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

function cdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

// Google Trends "Trending Now" RSS. No API key, no scraping lib. Undocumented
// but stable public endpoint — callers degrade gracefully if it changes.
export async function googleTrends(geo: string): Promise<Trend[]> {
  const res = await fetch(
    `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`,
    { next: { revalidate: TREND_CACHE_SECONDS } }
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

export async function youtubeTrends(nicheSlug: string): Promise<Trend[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("missing-key");
  const niche = getNiche(nicheSlug);
  const categoryId = niche ? NICHE_CATEGORY[niche.slug] : undefined;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("regionCode", "US");
  url.searchParams.set("maxResults", "20");
  if (categoryId) url.searchParams.set("videoCategoryId", categoryId);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate: TREND_CACHE_SECONDS } });
  if (!res.ok) throw new Error(`youtube ${res.status}`);
  const data = (await res.json()) as { items?: YouTubeItem[] };
  return (data.items || [])
    .map(it => ({
      title: it.snippet?.title?.trim() || "",
      sub: it.snippet?.channelTitle?.trim() || "",
    }))
    .filter(t => t.title.length > 0)
    .slice(0, 20);
}

// Best-effort in-memory cache for re-ranked results. On serverless each
// instance has its own memory — worst case is a few extra Claude calls per
// 6h, never one per page view.
const rerankCache = new Map<string, { at: number; data: Trend[] }>();

// YouTube categories are coarse (e.g. "Sports" for fitness/football). Ask
// Claude to keep only the items genuinely relevant to the creator's niche
// and order them by how easily they become a strong short-form hook.
export async function rerankForNiche(
  nicheSlug: string,
  trends: Trend[]
): Promise<Trend[]> {
  const niche = getNiche(nicheSlug);
  if (!niche || trends.length === 0) return trends;

  const cacheKey = `youtube:${niche.slug}`;
  const cached = rerankCache.get(cacheKey);
  if (cached && Date.now() - cached.at < TREND_CACHE_SECONDS * 1000) {
    return cached.data;
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      system: `You filter trending video titles for a specific creator niche. Keep ONLY titles a "${niche.label}" creator could realistically build a short-form video around. Drop unrelated ones. Order by how easily each becomes a scroll-stopping hook. Respond ONLY with valid JSON: {"titles":["exact title kept", ...]} using the exact input titles.`,
      messages: [
        {
          role: "user",
          content: `Niche: ${niche.label}\nTitles:\n${trends.map(t => `- ${t.title}`).join("\n")}`,
        },
      ],
    });
    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()) as { titles?: string[] };
    const kept = new Set(parsed.titles || []);
    const ranked = (parsed.titles || [])
      .map(title => trends.find(t => t.title === title))
      .filter((t): t is Trend => Boolean(t));
    const result = ranked.length > 0 ? ranked : trends.filter(t => kept.has(t.title));
    const final = result.length > 0 ? result.slice(0, 12) : trends.slice(0, 12);
    rerankCache.set(cacheKey, { at: Date.now(), data: final });
    return final;
  } catch {
    // Re-ranking is an enhancement — fall back to the raw feed on failure.
    return trends.slice(0, 12);
  }
}
