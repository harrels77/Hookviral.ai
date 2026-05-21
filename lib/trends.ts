import Anthropic from "@anthropic-ai/sdk";
import { getNiche } from "@/lib/niches";
import { upstashConfigured, pipeline, command } from "@/lib/upstash";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";
import { extractJson } from "@/lib/parseJson";

const PATTERN_NAMES = HOOK_PATTERNS.map(p => p.name);

export type Velocity = "rising" | "steady" | "cooling" | "new";
export interface Trend { title: string; sub: string; velocity?: Velocity; history?: number[] }
export type TrendSource = "google" | "youtube";

export const TREND_CACHE_SECONDS = 21600; // 6h — protects quotas / endpoints

// Coarse niche -> YouTube videoCategoryId. Unmapped niches fall back to
// general trending (no category filter).
const NICHE_CATEGORY: Record<string, string> = {
  sports: "17", // Sports
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

export async function youtubeTrends(nicheSlug: string, geo = "US"): Promise<Trend[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("missing-key");
  const niche = getNiche(nicheSlug);
  const categoryId = niche ? NICHE_CATEGORY[niche.slug] : undefined;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("regionCode", geo);
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
  trends: Trend[],
  source: TrendSource = "youtube"
): Promise<Trend[]> {
  const niche = getNiche(nicheSlug);
  if (!niche || trends.length === 0) return trends;

  const cacheKey = `${source}:${niche.slug}`;
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

// ── Search velocity ──
// Honest momentum signal: we snapshot the trend list per 6h bucket in Redis
// and compare each term's rank to the previous bucket. This measures movement
// in *search rank*, not video retention — never conflate the two. No Upstash
// or no prior snapshot → no badge (we don't fabricate a direction).
const BUCKET_MS = TREND_CACHE_SECONDS * 1000; // 6h, aligned with the fetch cache

const HISTORY_MAX = 8; // sparkline points kept per term

export interface VelocityResult {
  velocity: Map<string, Velocity>;
  history: Map<string, number[]>;
}

export async function computeVelocity(
  source: TrendSource,
  geo: string,
  trends: Trend[]
): Promise<VelocityResult> {
  const velocity = new Map<string, Velocity>();
  const history = new Map<string, number[]>();
  if (!upstashConfigured() || trends.length === 0) return { velocity, history };

  const bucket = Math.floor(Date.now() / BUCKET_MS);
  const curKey = `tv:${source}:${geo}:${bucket}`;
  const prevKey = `tv:${source}:${geo}:${bucket - 1}`;
  const histKey = `tvh:${source}:${geo}`;
  const curRanks: Record<string, number> = {};
  trends.forEach((t, i) => { curRanks[t.title] = i + 1; });

  try {
    const [prevRaw, , histRaw] = await pipeline([
      ["GET", prevKey],
      // Keep ~3 buckets so the previous snapshot is always available.
      ["SET", curKey, JSON.stringify(curRanks), "EX", TREND_CACHE_SECONDS * 3],
      ["GET", histKey],
    ]);

    // Rank-history for sparklines — one point per 6h bucket, capped.
    let hist: { bucket: number; ranks: Record<string, number[]> } =
      histRaw && typeof histRaw === "string"
        ? JSON.parse(histRaw)
        : { bucket: -1, ranks: {} };
    if (hist.bucket !== bucket) {
      const next: Record<string, number[]> = {};
      for (const t of trends) {
        const past = hist.ranks[t.title] || [];
        next[t.title] = [...past, curRanks[t.title]].slice(-HISTORY_MAX);
      }
      hist = { bucket, ranks: next };
      await command(["SET", histKey, JSON.stringify(hist), "EX", TREND_CACHE_SECONDS * (HISTORY_MAX + 2)]);
    }
    for (const t of trends) {
      const h = hist.ranks[t.title];
      if (h && h.length >= 3) history.set(t.title, h);
    }

    if (!prevRaw || typeof prevRaw !== "string") return { velocity, history }; // first cycle
    const prev = JSON.parse(prevRaw) as Record<string, number>;
    for (const t of trends) {
      const cur = curRanks[t.title];
      const was = prev[t.title];
      if (was === undefined) velocity.set(t.title, "new");
      else if (was - cur >= 2) velocity.set(t.title, "rising");
      else if (cur - was >= 2) velocity.set(t.title, "cooling");
      else velocity.set(t.title, "steady");
    }
  } catch {
    // Velocity is an enhancement — never block the trends response on it.
  }
  return { velocity, history };
}

// ── Trend → Research + Angles ──
// A raw trending term ("meghan markle england visit", "now stock") tells a
// creator nothing without context: who, what action, why it's spiking, what's
// at stake. This calls Claude with the web_search tool so the angles are
// grounded in real reporting, not invented from the name alone — then returns
// 3-5 strategic angles each with a scored hook and the source URLs cited.
//
// Cost note: web_search has a per-call charge. We cache 6h in-memory + Upstash
// so the same trend clicked by N users hits the search exactly once per bucket.
export type TrendKind = "news" | "evergreen";
export interface TrendAngle { angle: string; reasoning?: string; hook: string; score: number; patternsUsed?: string[] }
export interface TrendContext {
  who: string;
  what: string;
  whyTrending: string;
  stakes: string;
  timeline: string;
}
export interface DecodedTrend {
  context: TrendContext;
  kind: TrendKind;
  angles: TrendAngle[];
  sources: string[];
}

const decodeCache = new Map<string, { at: number; data: DecodedTrend }>();
const RESEARCH_CACHE_PREFIX = "tr:research:";

async function getCachedResearch(key: string): Promise<DecodedTrend | null> {
  const mem = decodeCache.get(key);
  if (mem && Date.now() - mem.at < TREND_CACHE_SECONDS * 1000) return mem.data;
  if (!upstashConfigured()) return null;
  try {
    const raw = await command(["GET", `${RESEARCH_CACHE_PREFIX}${key}`]);
    if (raw && typeof raw === "string") {
      const data = JSON.parse(raw) as DecodedTrend;
      decodeCache.set(key, { at: Date.now(), data });
      return data;
    }
  } catch {
    /* cache is an optimization — never block on it */
  }
  return null;
}

async function setCachedResearch(key: string, data: DecodedTrend) {
  decodeCache.set(key, { at: Date.now(), data });
  if (!upstashConfigured()) return;
  try {
    await command([
      "SET", `${RESEARCH_CACHE_PREFIX}${key}`,
      JSON.stringify(data), "EX", TREND_CACHE_SECONDS,
    ]);
  } catch {
    /* same — best effort */
  }
}

export async function decodeTrend(
  trend: string,
  nicheSlug: string
): Promise<DecodedTrend> {
  const niche = getNiche(nicheSlug);
  const audience = niche ? `a ${niche.label} short-form creator` : "a short-form video creator";

  const cacheKey = `${niche?.slug || "any"}:${trend.toLowerCase().slice(0, 160)}`;
  const cached = await getCachedResearch(cacheKey);
  if (cached) return cached;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // max_tokens 3000: web_search costs tokens internally (queries + result
  // chunks Claude reads), and the final JSON is 5 angles × {angle, reasoning,
  // hook, score, patternsUsed} + a full context block + sources array.
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    tools: [
      {
        // Anthropic-managed web search. Claude runs the queries itself and we
        // just read the final text output — no tool_use/tool_result loop.
        // 3 searches is enough for context + recency; cap protects spend.
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 3,
      },
    ],
    system: `You are a content strategist researching a trending topic for ${audience}.

STEP 1 — RESEARCH. Use web_search 1-3 times to find:
- Who/what the trend refers to (the specific actors)
- The exact action or event causing the spike (not vague — what concretely happened)
- Why it's trending right now (the emotional/news trigger)
- What's at stake (controversy, surprise, money, reputation, danger)
- Timeline (today / this week / ongoing)

If the trend is evergreen (no specific news event), search for the most viral angles people are talking about right now on this topic instead.

STEP 2 — STRATEGIZE. Produce 3-5 distinct strategic angles a ${audience} could film today. Each angle must be a specific story, not a vague theme. Avoid filler ("here's what you need to know"). Pick angles that play on the actual stakes you found.

ATTENTION PATTERNS — for each hook, tag the 1-3 patterns it uses, picking ONLY from this owned vocabulary (use the exact names, never invent):
${PATTERN_VOCAB}

STEP 3 — RESPOND. Output ONLY this JSON, no markdown, no preamble:
{
  "context": {
    "who": "1-2 sentences on the actors involved",
    "what": "1-2 sentences on the specific event or action",
    "whyTrending": "1 sentence on why this is spiking right now",
    "stakes": "1 sentence on the emotional/material stakes — what makes people care",
    "timeline": "when this is happening (e.g. 'broke today', 'ongoing since Monday', 'evergreen')"
  },
  "kind": "news" or "evergreen",
  "angles": [
    {
      "angle": "the specific story this video tells",
      "reasoning": "1 sentence on why this angle stops the scroll for this creator's audience",
      "hook": "ready scroll-stopping hook, max 18 words, starts with 1 relevant emoji",
      "score": 0-100,
      "patternsUsed": ["Open Loop", "Stakes"]
    }
  ],
  "sources": ["url1", "url2"]
}

Return 3-5 angles (more if the trend is rich, fewer if thin). score = honest 0-100 likelihood the hook stops the scroll in 3 seconds — DO NOT inflate. sources = the URLs you actually searched and used. Match the language of the trend.`,
    messages: [{ role: "user", content: `Trend: "${trend.slice(0, 160)}"\nCreator: ${audience}\n\nResearch, then strategize.` }],
  });

  const raw = message.content
    .filter(b => b.type === "text")
    .map(b => (b as { type: "text"; text: string }).text)
    .join("");
  const parsed = extractJson<{
    context?: Partial<TrendContext>;
    kind?: string;
    angles?: { angle?: string; reasoning?: string; hook?: string; score?: number; patternsUsed?: unknown }[];
    sources?: unknown;
  }>(raw);

  const ctx = parsed.context || {};
  const data: DecodedTrend = {
    context: {
      who: typeof ctx.who === "string" ? ctx.who.trim() : "",
      what: typeof ctx.what === "string" ? ctx.what.trim() : "",
      whyTrending: typeof ctx.whyTrending === "string" ? ctx.whyTrending.trim() : "",
      stakes: typeof ctx.stakes === "string" ? ctx.stakes.trim() : "",
      timeline: typeof ctx.timeline === "string" ? ctx.timeline.trim() : "",
    },
    kind: parsed.kind === "evergreen" ? "evergreen" : "news",
    angles: (parsed.angles || [])
      .filter(a => a && typeof a.angle === "string" && typeof a.hook === "string")
      .slice(0, 5)
      .map(a => ({
        angle: a.angle!.trim(),
        reasoning: typeof a.reasoning === "string" ? a.reasoning.trim() : "",
        hook: a.hook!.trim(),
        score: Math.max(0, Math.min(100, Math.round(Number(a.score) || 0))),
        patternsUsed: Array.isArray(a.patternsUsed)
          ? a.patternsUsed.filter((x): x is string => typeof x === "string" && PATTERN_NAMES.includes(x)).slice(0, 3)
          : [],
      })),
    sources: Array.isArray(parsed.sources)
      ? parsed.sources.filter((x): x is string => typeof x === "string" && /^https?:\/\//i.test(x)).slice(0, 8)
      : [],
  };

  await setCachedResearch(cacheKey, data);
  return data;
}
