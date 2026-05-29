import Anthropic from "@anthropic-ai/sdk";
import { getNiche } from "@/lib/niches";
import { upstashConfigured, pipeline, command } from "@/lib/upstash";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";
import { platformGuidance } from "@/lib/platforms";
import { extractJson } from "@/lib/parseJson";

const PATTERN_NAMES = HOOK_PATTERNS.map(p => p.name);

export type Velocity = "rising" | "steady" | "cooling" | "new";
export type TrendSource = "google" | "youtube" | "reddit" | "wikipedia" | "hackernews" | "bluesky";
// `source` is tagged when trends from multiple sources are merged into one
// list, so each card can show which feed it came from. Optional because
// historical callers (and the still-typed-array returns inside this file
// before tagging) don't carry it.
export interface Trend { title: string; sub: string; source?: TrendSource; velocity?: Velocity; history?: number[] }

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

// Single-geo Google Trends "Trending Now" RSS — the only free, stable endpoint
// Google still serves as of 2026 (dailytrends + realtime JSON APIs returned
// 404 in live testing — decommissioned in the 2024 redesign). Returns ~10
// items per geo, period. We expose this via googleTrends() with multi-geo
// merge for the "GLOBAL" pseudo-geo, since one geo alone is now too thin.
async function googleTrendsSingle(geo: string): Promise<Trend[]> {
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
    .slice(0, 30);
}

// Geos we fan out to when user picks "GLOBAL". Six picks cover the largest
// English/EU search markets. ~10 items each × 6 → ~30 unique after dedupe.
const GLOBAL_GEOS = ["US", "GB", "CA", "AU", "DE", "FR"];

export async function googleTrends(geo: string): Promise<Trend[]> {
  if (geo !== "GLOBAL") return googleTrendsSingle(geo);

  // Parallel fan-out. allSettled so one bad geo (rare 5xx) doesn't kill
  // the whole merge — we just take what we got. Order: items appearing in
  // multiple geos float to the top via first-seen position in the array
  // (US first, then GB, CA…). This gives a rough "broad consensus" ranking.
  const results = await Promise.allSettled(GLOBAL_GEOS.map(g => googleTrendsSingle(g)));
  const seen = new Set<string>();
  const out: Trend[] = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const t of r.value) {
      const key = t.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
      if (out.length >= 50) return out;
    }
  }
  return out;
}

// ── Reddit /r/popular ──
// 30-50 trending posts across all subreddits. Different signal from Google:
// cultural buzz / what people are talking about, not what they're searching.
//
// Auth context: the unauthenticated www.reddit.com/r/popular.json endpoint
// USED to work from anywhere. Since Reddit's mid-2023 API tightening (same
// wave that killed Apollo), unauthenticated requests from datacenter IPs
// (Vercel / AWS / GCP) are 403'd or rate-limited into uselessness. The
// browser-IP path still works locally, which is why this surfaced as
// "works in dev, breaks in prod." Production requires OAuth.
//
// We use the `client_credentials` flow (script-app auth, no user context
// needed). Register at reddit.com/prefs/apps → set REDDIT_CLIENT_ID +
// REDDIT_CLIENT_SECRET. Token is good for 1h; we cache it in-memory and
// refresh 60s before expiry. NSFW + stickied filtered out.

const REDDIT_UA = "HookViral/1.0 (+https://hookviral.ai)";

// Per-instance token cache. 1h validity per Reddit; even with cold starts
// the worst case is one extra ~50ms token fetch per instance per hour.
let redditToken: { token: string; exp: number } | null = null;

async function getRedditToken(): Promise<string | null> {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (redditToken && Date.now() < redditToken.exp) return redditToken.token;

  // btoa works in both Node and Edge runtimes — avoid Buffer for portability.
  const basic = btoa(`${id}:${secret}`);
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": REDDIT_UA,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`reddit oauth ${res.status}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("reddit oauth no token");
  // Refresh 60s before actual expiry so we never call with a stale token.
  redditToken = {
    token: data.access_token,
    exp: Date.now() + Math.max(60, (data.expires_in ?? 3600) - 60) * 1000,
  };
  return redditToken.token;
}

interface RedditChild {
  data?: {
    title?: string;
    subreddit?: string;
    score?: number;
    num_comments?: number;
    over_18?: boolean;
    stickied?: boolean;
  };
}

// Per-instance cache for the /r/popular payload. We can't rely on Next.js's
// fetch cache here because the Authorization header rotates each token
// refresh — that would bust the cache key needlessly. Our own 6h cache
// matches what we do for the YouTube/Google paths conceptually.
let popularCache: { data: Trend[]; exp: number } | null = null;

export async function redditPopular(): Promise<Trend[]> {
  if (popularCache && Date.now() < popularCache.exp) return popularCache.data;

  const token = await getRedditToken();
  // `missing-key` is the convention the route layer catches to set
  // configured=false and surface the env-var hint banner in the UI.
  if (!token) throw new Error("missing-key");

  const res = await fetch("https://oauth.reddit.com/r/popular?limit=50", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": REDDIT_UA,
    },
  });
  if (!res.ok) throw new Error(`reddit popular ${res.status}`);
  const data = (await res.json()) as { data?: { children?: RedditChild[] } };
  const children = data?.data?.children || [];
  const trends = children
    .map(c => {
      const d = c?.data;
      if (!d || d.over_18 || d.stickied) return null;
      const title = d.title?.trim();
      if (!title) return null;
      const subreddit = d.subreddit?.trim() || "";
      const score = typeof d.score === "number" ? d.score : 0;
      // "12.3k upvotes · r/todayilearned" — gives the user context without
      // being noisy. Format upvotes once we exceed 1k.
      const formatted = score >= 1000 ? `${(score / 1000).toFixed(1)}k upvotes` : `${score} upvotes`;
      const sub = subreddit ? `r/${subreddit} · ${formatted}` : formatted;
      return { title, sub };
    })
    .filter((t): t is Trend => t !== null)
    .slice(0, 50);

  popularCache = { data: trends, exp: Date.now() + TREND_CACHE_SECONDS * 1000 };
  return trends;
}

// ── Wikipedia top viewed ──
// Wikimedia pageviews API: top articles by views, up to 1000/day. Free,
// official, no auth, no rate-limit drama from cloud IPs (unlike Reddit).
// Signal = what the public is *researching* today — overlaps news but
// also captures "I saw this on TV/podcast/headline, who is this?"
// curiosity that Google searches miss.
const WIKI_UA = "HookViral/1.0 (https://hookviral.ai)";

// Geo → Wikipedia project. The pageviews API is per-language-wiki, which
// is the closest proxy to "what's trending in this region's reading list."
// GLOBAL + English-speaking geos fall back to en.wikipedia (largest by
// volume); FR/ES/DE get their own language wiki.
const WIKI_PROJECTS: Record<string, string> = {
  GLOBAL: "en.wikipedia",
  US: "en.wikipedia",
  GB: "en.wikipedia",
  CA: "en.wikipedia",
  AU: "en.wikipedia",
  FR: "fr.wikipedia",
  ES: "es.wikipedia",
  DE: "de.wikipedia",
};

// Wikipedia namespace pages (Main_Page, Special:Search, Wikipedia:..., etc.)
// always top the list and are useless as creator content angles. The regex
// covers all 14 reserved namespace prefixes; `Main_Page` + bare `Wikipedia`
// are special cases.
function isWikipediaMeta(title: string): boolean {
  if (title === "Main_Page" || title === "Wikipedia" || title === "-") return true;
  return /^(Special|Wikipedia|Portal|Help|Category|File|Template|User|Talk|Module|Draft|MediaWiki|Book|TimedText):/i.test(title);
}

export async function wikipediaTrends(geo: string): Promise<Trend[]> {
  const project = WIKI_PROJECTS[geo] || "en.wikipedia";
  // The "top" pageviews aggregate lags ~24-48h, NOT 24h — verified live:
  // J-1 returns 404 until the day is fully aggregated (often well past UTC
  // midnight), J-2 is reliably available. Hardcoding J-1 meant Wikipedia
  // silently returned nothing every day until ~midday UTC. Walk back from
  // J-1 to J-3 and use the first day that's published, so we always serve
  // the freshest available data.
  for (let back = 1; back <= 3; back++) {
    const d = new Date(Date.now() - back * 24 * 3600 * 1000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");

    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${project}/all-access/${y}/${m}/${day}`;
    const res = await fetch(url, {
      next: { revalidate: TREND_CACHE_SECONDS },
      headers: { "User-Agent": WIKI_UA },
    });
    // 404 = that day isn't aggregated yet; try the day before.
    if (res.status === 404) continue;
    if (!res.ok) throw new Error(`wikipedia ${res.status}`);
    const data = (await res.json()) as {
      items?: { articles?: { article?: string; views?: number; rank?: number }[] }[];
    };
    const articles = data.items?.[0]?.articles || [];
    return articles
      .map(a => {
        if (!a.article || isWikipediaMeta(a.article)) return null;
        // Wikipedia uses underscores in URLs; humanize for display.
        const title = a.article.replace(/_/g, " ");
        const views = typeof a.views === "number" ? a.views : 0;
        const formatted = views >= 1_000_000
          ? `${(views / 1_000_000).toFixed(1)}M views`
          : views >= 1000
            ? `${Math.round(views / 1000)}k views`
            : `${views} views`;
        return { title, sub: formatted };
      })
      .filter((t): t is Trend => t !== null)
      .slice(0, 50);
  }
  // All of J-1..J-3 were 404 (extremely unlikely) — return empty so the
  // merge keeps the other sources instead of throwing.
  return [];
}

// ── Hacker News front page ──
// The Firebase API exposes /topstories.json as a list of 500 IDs, requiring
// one fetch per item — 500 round-trips just for titles. Algolia's HN search
// (what news.ycombinator.com's own search uses) returns the same front page
// with titles + scores + comments in one call. Free, no auth, no IP issues.
// Signal = tech/biz/startup, narrow but punchy. Niche-aware rerank already
// filters when relevant.
interface HNHit { title?: string; points?: number; num_comments?: number; }

export async function hackerNewsTrends(): Promise<Trend[]> {
  const res = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=50",
    { next: { revalidate: TREND_CACHE_SECONDS } }
  );
  if (!res.ok) throw new Error(`hackernews ${res.status}`);
  const data = (await res.json()) as { hits?: HNHit[] };
  return (data.hits || [])
    .map(h => {
      const title = h.title?.trim();
      if (!title) return null;
      const points = h.points ?? 0;
      const comments = h.num_comments ?? 0;
      return { title, sub: `${points} points · ${comments} comments` };
    })
    .filter((t): t is Trend => t !== null)
    .slice(0, 50);
}

// ── Bluesky "what's hot" feed ──
// atproto's appview exposes public read endpoints with NO auth — unlike
// Reddit, the platform was built API-first and the data is intentionally
// crawlable. We read a curated "what's hot" feed via app.bsky.feed.getFeed.
// Smaller audience than Reddit but growing fast in 2026 and conversationally
// dense (every post is a take, not a meme link), which makes it a good
// "what's the discourse" signal to complement Wikipedia (research interest)
// and Google (search queries).
//
// Stability caveat: the feed URI below is a community-curated generator. If
// the curator ever takes it down or renames it, this 404s — the route catches
// and other sources keep working, no production breakage. Update the URI then.
const BLUESKY_HOT_FEED = "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot-classic";

interface BlueskyPost {
  post?: {
    record?: { text?: string };
    author?: { handle?: string };
    likeCount?: number;
    replyCount?: number;
    repostCount?: number;
  };
}

export async function blueskyTrends(): Promise<Trend[]> {
  const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=${encodeURIComponent(BLUESKY_HOT_FEED)}&limit=50`;
  const res = await fetch(url, { next: { revalidate: TREND_CACHE_SECONDS } });
  if (!res.ok) throw new Error(`bluesky ${res.status}`);
  const data = (await res.json()) as { feed?: BlueskyPost[] };
  return (data.feed || [])
    .map(item => {
      const p = item.post;
      // Collapse newlines + extra whitespace — Bluesky posts can be multiline
      // and we render single-line trend cards. Truncate long posts at 140
      // chars; gives enough context to judge the topic without dominating the
      // grid layout.
      const raw = p?.record?.text?.trim().replace(/\s+/g, " ");
      if (!raw) return null;
      const title = raw.length > 140 ? raw.slice(0, 140).trim() + "…" : raw;
      const handle = p?.author?.handle || "";
      const likes = p?.likeCount ?? 0;
      const replies = p?.replyCount ?? 0;
      const fmtLikes = likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : `${likes}`;
      const sub = handle
        ? `@${handle} · ↑${fmtLikes} · 💬${replies}`
        : `↑${fmtLikes} · 💬${replies}`;
      return { title, sub };
    })
    .filter((t): t is Trend => t !== null)
    .slice(0, 50);
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
  // YouTube API hard ceiling is 50. We were leaving 60% of the available
  // signal on the table by asking for 20 — bumped to the cap.
  url.searchParams.set("maxResults", "50");
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
    .slice(0, 50);
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
  cacheTag: string = "default"
): Promise<Trend[]> {
  const niche = getNiche(nicheSlug);
  if (!niche || trends.length === 0) return trends;

  // Cache key is opaque — caller chooses an identifier that captures every
  // axis it varies on (source(s) + geo). Earlier versions hardcoded
  // `source:nicheSlug` and changing the geo (or merging sources) silently
  // returned a stale rerank — "same trends no matter what filter."
  const cacheKey = `${niche.slug}:${cacheTag}`;
  const cached = rerankCache.get(cacheKey);
  if (cached && Date.now() - cached.at < TREND_CACHE_SECONDS * 1000) {
    return cached.data;
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      // 1200 tokens (was 700): with up to ~50 input titles and the response
      // echoing the kept ones verbatim, 700 truncated the JSON array on
      // larger reranks and the whole filter quietly fell back to the raw feed.
      max_tokens: 1200,
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
    // extractJson is the resilient parser (handles ```json fences, preamble,
    // escapes). The previous JSON.parse(raw.replace(...)) chain threw on any
    // wrapping prose and the whole rerank silently fell back to the raw feed.
    const parsed = extractJson<{ titles?: string[] }>(raw);
    const kept = new Set(parsed.titles || []);
    const ranked = (parsed.titles || [])
      .map(title => trends.find(t => t.title === title))
      .filter((t): t is Trend => Boolean(t));
    const result = ranked.length > 0 ? ranked : trends.filter(t => kept.has(t.title));
    // Keep everything Claude marked relevant for the niche, with a 40 ceiling
    // so a misbehaving response doesn't flood the grid. Was 12 — too tight,
    // killed the long tail that's often where a creator finds an angle.
    const final = result.length > 0 ? result.slice(0, 40) : trends.slice(0, 40);
    rerankCache.set(cacheKey, { at: Date.now(), data: final });
    return final;
  } catch {
    // Re-ranking is an enhancement — fall back to the raw feed on failure.
    return trends.slice(0, 40);
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
  nicheSlug: string,
  // Optional target platform. Research currently runs without a user-selected
  // platform so we default to TikTok psychology — the most active short-form
  // market and the natural endpoint for trend → hook. When the Research page
  // ships a platform selector, pass it through here. Including the slug in
  // the cache key prevents one platform's hooks from being served for another.
  platformSlug: string = "tiktok"
): Promise<DecodedTrend> {
  const niche = getNiche(nicheSlug);
  const audience = niche ? `a ${niche.label} short-form creator` : "a short-form video creator";
  const platformBlock = platformGuidance(platformSlug);

  const cacheKey = `${niche?.slug || "any"}:${platformSlug}:${trend.toLowerCase().slice(0, 160)}`;
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

PLATFORM PSYCHOLOGY (every hook you write must hit this lens — score honestly against these criteria)
${platformBlock}

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
