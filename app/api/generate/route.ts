import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { matchNiche } from "@/lib/niches";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";
import { getPlatform, DEFAULT_PLATFORM_SLUG, type Platform } from "@/lib/platforms";
import { extractJson } from "@/lib/parseJson";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PATTERN_NAMES = HOOK_PATTERNS.map(p => p.name);

// Build the platform psychology block from selected platforms. If the user
// chose multiple platforms (the Generator UI lets them), each block goes in
// — Claude can then specialize hooks per platform inside the same response.
function buildPlatformBlock(platforms: Platform[]): string {
  if (platforms.length === 0) return "";
  if (platforms.length === 1) return `PLATFORM PSYCHOLOGY\n${platforms[0].guidance}`;
  return [
    "PLATFORM PSYCHOLOGY (you may target multiple — adapt each hook to its platform field)",
    ...platforms.map(p => p.guidance),
  ].join("\n\n");
}

function buildSystemPrompt(platforms: Platform[]): string {
  return `You are the world's #1 viral content strategist in 2026. You have studied every viral short-form video across TikTok, Instagram Reels, and YouTube Shorts. Your hooks have generated over 500M views combined.

${buildPlatformBlock(platforms)}

HOOK FORMULAS — use each ONCE across the 8 hooks:
1. Curiosity Gap — tease without revealing
2. Loss Aversion — what they're actively losing
3. Story Starter — open a story with implied big result
4. Shock Value — counterintuitive fact that stops the scroll
5. Number + Promise — specific number + clear transformation
6. Contrarian Statement — challenge the dominant belief
7. Relatable Confession — vulnerable, human, mirrors viewer's pain
8. Visual / Movement — "Watch this", "POV:", action-first

QUALITY RULES
- Sound like a real human creator, NOT corporate AI
- No clichés: "game-changer", "unlock your potential", "dive into"
- Each hook must create an open loop forcing the viewer to keep watching
- Max 18 words per hook
- Start with 1 relevant emoji
- Adapt to the conversion goal specified

SCORING (0-100, likelihood it stops the scroll in 3s — honest, do not inflate)
- 95-99: Would stop 9/10 scrollers
- 90-94: Strong, proven formula executed well
- 85-89: Good, minor improvements possible
- 80-84: Decent but could be sharper

ATTENTION PATTERNS — for each hook, tag the 1-3 patterns it uses, picking ONLY from this owned vocabulary (use the exact names, never invent your own):
${PATTERN_VOCAB}

REASONING — for each hook, include a 1-sentence "reasoning" field naming the dominant psychological lever the hook is pulling (e.g. "Triggers loss aversion by quantifying the cost of inaction." or "Pattern-interrupts with an exact number nobody can guess."). Plain, specific, not generic.

Respond ONLY with valid JSON, no markdown:
{
  "hooks": [
    { "text": "...", "formula": "Curiosity Gap", "platform": "TikTok", "score": 94, "patternsUsed": ["Open Loop", "Concrete Specificity"], "reasoning": "Withholds the answer with a specific count, forcing the viewer to stay for the resolution." }
  ]
}

IMPORTANT: Match the language of the topic input exactly.`;
}

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`generate:${getClientIp(req)}`, 20, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { topic, platforms, tone, niche, goal } = await req.json();

    const nicheMode = matchNiche(niche || "");

    // Resolve platforms → Platform objects (silently dropping invalid slugs).
    // Falls back to the default platform if nothing matched so the prompt
    // always carries SOME psychology block.
    const platformList = (Array.isArray(platforms) ? platforms : ["TikTok"])
      .map((p: unknown) => typeof p === "string" ? getPlatform(p) : undefined)
      .filter((p): p is Platform => Boolean(p));
    const resolvedPlatforms = platformList.length > 0
      ? platformList
      : [getPlatform(DEFAULT_PLATFORM_SLUG)!];

    const userMessage = [
      `Topic: "${topic || "general content"}"`,
      `Platform(s): ${resolvedPlatforms.map(p => p.label).join(", ")}`,
      `Tone: ${tone || "Authentic"}`,
      niche ? `Niche: ${niche}` : "",
      nicheMode ? `Niche guidance: ${nicheMode.guidance}` : "",
      goal ? `Conversion goal: ${goal}` : "",
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      // Bumped from 1500 → 1800 to fit the new per-hook reasoning field.
      // 8 hooks × ~25 tokens for reasoning ≈ 200 extra tokens, plus headroom.
      max_tokens: 1800,
      system: buildSystemPrompt(resolvedPlatforms),
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    // Use extractJson to survive the occasional preamble or stray fence.
    // The route used to JSON.parse with a regex strip and would 500 on any
    // wrapping prose — propagating the same resilient parser we use in
    // decodeTrend / strategic-takes / analyze.
    const parsed = extractJson<{
      hooks: { text?: string; formula?: string; platform?: string; score?: number; patternsUsed?: unknown; reasoning?: unknown }[];
    }>(raw);
    // Server-side whitelist: drop any pattern name the model invented outside the corpus.
    const hooks = (parsed.hooks || []).map((h, i) => {
      const used = Array.isArray(h.patternsUsed)
        ? h.patternsUsed.filter((x): x is string => typeof x === "string" && PATTERN_NAMES.includes(x)).slice(0, 3)
        : [];
      const reasoning = typeof h.reasoning === "string" ? h.reasoning.trim() : "";
      return { ...h, id: `${Date.now()}-${i}`, patternsUsed: used, reasoning };
    });

    return NextResponse.json({ hooks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed. Check your API key." }, { status: 500 });
  }
}
