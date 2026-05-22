import Anthropic from "@anthropic-ai/sdk";
import { getNiche } from "@/lib/niches";
import { upstashConfigured, command } from "@/lib/upstash";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";
import { extractJson } from "@/lib/parseJson";

// ── Strategic Takes ──
// Different from /trends/research. Research dumps context + loose angles.
// Takes are explicit OPPOSING positions a creator can defend: "the takedown",
// "the defense", "the contrarian data view" — each with arguments + ready
// hooks. This is the differentiator no general AI tool surfaces well: a
// content strategist's framing, not a hook list. Triggered from Analyzer
// when the user pastes a subject instead of a hook.

const PATTERN_NAMES = HOOK_PATTERNS.map(p => p.name);
const TAKES_CACHE_SECONDS = 6 * 3600;
const TAKES_CACHE_PREFIX = "tr:takes:";

export interface TakeHook {
  text: string;
  score: number;
  patternsUsed?: string[];
}
export interface Take {
  emoji: string;
  name: string;       // e.g. "The takedown"
  stance: string;     // 1-2 sentence position summary
  reasoning: string;  // why this stance wins attention
  arguments: string[]; // 3-5 concrete talking points
  hooks: TakeHook[];   // 2-3 scored hooks for this take
}
export interface StrategicTakes {
  isControversial: boolean;
  takes: Take[];
  sources: string[];
}

const memCache = new Map<string, { at: number; data: StrategicTakes }>();

async function getCached(key: string): Promise<StrategicTakes | null> {
  const mem = memCache.get(key);
  if (mem && Date.now() - mem.at < TAKES_CACHE_SECONDS * 1000) return mem.data;
  if (!upstashConfigured()) return null;
  try {
    const raw = await command(["GET", `${TAKES_CACHE_PREFIX}${key}`]);
    if (raw && typeof raw === "string") {
      const data = JSON.parse(raw) as StrategicTakes;
      memCache.set(key, { at: Date.now(), data });
      return data;
    }
  } catch {
    /* cache is optional — never block on it */
  }
  return null;
}

async function setCached(key: string, data: StrategicTakes) {
  memCache.set(key, { at: Date.now(), data });
  if (!upstashConfigured()) return;
  try {
    await command([
      "SET", `${TAKES_CACHE_PREFIX}${key}`,
      JSON.stringify(data), "EX", TAKES_CACHE_SECONDS,
    ]);
  } catch {
    /* best effort */
  }
}

// Shape of the raw model output before we sanitize it.
interface RawHook { text?: unknown; score?: unknown; patternsUsed?: unknown }
interface RawTake {
  emoji?: unknown; name?: unknown; stance?: unknown;
  reasoning?: unknown; arguments?: unknown; hooks?: unknown;
}

export async function strategicTakes(
  subject: string,
  nicheSlug: string
): Promise<StrategicTakes> {
  const niche = getNiche(nicheSlug);
  const audience = niche ? `${niche.label} short-form creator` : "short-form creator";

  const cacheKey = `${niche?.slug || "any"}:${subject.toLowerCase().slice(0, 100)}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    // 3000 to cover 3 takes × {emoji, name, stance, reasoning, 5 arguments,
    // 3 hooks × {text, score, 3 patterns}} + sources + web_search internals.
    max_tokens: 3000,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 3,
      },
    ],
    system: `You are a content strategist helping a ${audience} pick a strong, defendable POSITION on a subject so they can make a short-form video that stands out — not a balanced explainer.

STEP 1 — RESEARCH. Use web_search 1-3 times to find:
- Current state of the subject (latest news, stats, who's involved)
- The factions / opposing camps in public discourse around it
- Concrete arguments each camp uses (numbers, names, quotes)
- Surprising or contrarian data

STEP 2 — STRATEGIZE. Produce 2-3 DISTINCT strategic positions a creator could defend. Each position must be:
- A clear stance, not a balanced summary — pick a side or angle that POLARIZES
- Backed by 3-5 SPECIFIC arguments (real numbers, real names, real quotes — not vague platitudes)
- Designed to provoke engagement (comments, debate, shares)

Position framings to consider (pick whichever fits — don't force all):
- "The takedown" — critique with hard evidence
- "The defense" — counter-narrative against the dominant take
- "The data view" — let surprising numbers tell the story
- "The contrarian" — what everyone is missing
- "The insider angle" — what people inside the field know that outsiders don't

If the subject genuinely has no opposing camps (e.g. "morning routine"), still produce 2-3 takes via different lenses (optimistic / skeptical / practical), but flag isControversial: false.

STEP 3 — HOOKS. For each position, write 2-3 ready scroll-stopping hooks (max 18 words, start with 1 relevant emoji, match the subject's language — French in, French out).

ATTENTION PATTERNS — tag each hook with 1-3 patterns from this exact vocabulary, never invent names:
${PATTERN_VOCAB}

STEP 4 — RESPOND. ONLY this JSON, no preamble, no markdown:
{
  "isControversial": boolean,
  "takes": [
    {
      "emoji": "single emoji that captures the stance (e.g. 🥊 🛡️ 📊 🤔 🔍)",
      "name": "1-3 word position name (e.g. 'The takedown')",
      "stance": "1-2 sentences summarizing the position",
      "reasoning": "1 sentence on why this stance wins attention for the creator",
      "arguments": ["specific arg 1 with real detail", "specific arg 2", ...],
      "hooks": [
        { "text": "...", "score": 0-100, "patternsUsed": ["Open Loop", "Stakes"] }
      ]
    }
  ],
  "sources": ["url1", "url2"]
}

Honest scoring — 0-100 likelihood the hook stops the scroll in 3s. Don't inflate. Return 2-3 takes. Match the language of the subject.`,
    messages: [
      {
        role: "user",
        content: `Subject: "${subject.slice(0, 160)}"\nCreator: ${audience}\n\nResearch the subject, then give me strategic positions with arguments and ready hooks.`,
      },
    ],
  });

  const raw = message.content
    .filter(b => b.type === "text")
    .map(b => (b as { type: "text"; text: string }).text)
    .join("");

  const parsed = extractJson<{
    isControversial?: unknown;
    takes?: RawTake[];
    sources?: unknown;
  }>(raw);

  const data: StrategicTakes = {
    isControversial: !!parsed.isControversial,
    takes: (parsed.takes || []).slice(0, 3).map((t: RawTake): Take => ({
      emoji: typeof t.emoji === "string" && t.emoji.trim() ? t.emoji.trim() : "💡",
      name: typeof t.name === "string" ? t.name.trim().slice(0, 40) : "Take",
      stance: typeof t.stance === "string" ? t.stance.trim() : "",
      reasoning: typeof t.reasoning === "string" ? t.reasoning.trim() : "",
      arguments: Array.isArray(t.arguments)
        ? t.arguments.filter((x): x is string => typeof x === "string" && x.trim().length > 0).slice(0, 6)
        : [],
      hooks: Array.isArray(t.hooks)
        ? t.hooks
            .slice(0, 3)
            .map((h: RawHook): TakeHook => ({
              text: typeof h.text === "string" ? h.text.trim() : "",
              score: Math.max(0, Math.min(100, Math.round(Number(h.score) || 0))),
              patternsUsed: Array.isArray(h.patternsUsed)
                ? h.patternsUsed
                    .filter((p): p is string => typeof p === "string" && PATTERN_NAMES.includes(p))
                    .slice(0, 3)
                : [],
            }))
            .filter((h: TakeHook) => h.text)
        : [],
    })).filter((t: Take) => t.stance && t.hooks.length > 0),
    sources: Array.isArray(parsed.sources)
      ? parsed.sources.filter((x): x is string => typeof x === "string" && /^https?:\/\//i.test(x)).slice(0, 8)
      : [],
  };

  await setCached(cacheKey, data);
  return data;
}
