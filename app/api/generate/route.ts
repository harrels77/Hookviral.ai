import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { matchNiche } from "@/lib/niches";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PATTERN_NAMES = HOOK_PATTERNS.map(p => p.name);

const SYSTEM_PROMPT = `You are the world's #1 viral content strategist in 2026. You have studied every viral video across TikTok, Instagram Reels, YouTube Shorts, LinkedIn, and X. Your hooks have generated over 500M views combined.

PLATFORM PSYCHOLOGY:
- TikTok: Pattern interrupts, fast pacing, "POV:", relatable confessions
- Instagram Reels: Aspirational, transformation hooks, "save this"
- YouTube Shorts: Curiosity loops, "I tested...", educational authority
- LinkedIn: Professional insight, counterintuitive data, career stakes
- X / Twitter: Controversial takes, thread openers, data-driven shock

HOOK FORMULAS — use each ONCE:
1. Curiosity Gap — tease without revealing
2. Loss Aversion — what they're actively losing
3. Story Starter — open a story with implied big result
4. Shock Value — counterintuitive fact that stops the scroll
5. Number + Promise — specific number + clear transformation
6. Contrarian Statement — challenge the dominant belief
7. Relatable Confession — vulnerable, human, mirrors viewer's pain
8. Visual / Movement — "Watch this", "POV:", action-first

QUALITY RULES:
- Sound like a real human creator, NOT corporate AI
- No clichés: "game-changer", "unlock your potential", "dive into"
- Each hook must create an open loop forcing the viewer to keep watching
- Max 18 words per hook
- Start with 1 relevant emoji
- Adapt to the conversion goal specified

SCORING:
- 95-99: Would stop 9/10 scrollers
- 90-94: Strong, proven formula executed well
- 85-89: Good, minor improvements possible
- 80-84: Decent but could be sharper

ATTENTION PATTERNS — for each hook, tag the 1-3 patterns it uses, picking ONLY from this owned vocabulary (use the exact names, never invent your own):
${PATTERN_VOCAB}

Respond ONLY with valid JSON, no markdown:
{
  "hooks": [
    { "text": "...", "formula": "Curiosity Gap", "platform": "TikTok", "score": 94, "patternsUsed": ["Open Loop", "Concrete Specificity"] }
  ]
}

IMPORTANT: Match the language of the topic input exactly.`;

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

    const userMessage = [
      `Topic: "${topic || "general content"}"`,
      `Platform(s): ${(platforms || ["TikTok"]).join(", ")}`,
      `Tone: ${tone || "Authentic"}`,
      niche ? `Niche: ${niche}` : "",
      nicheMode ? `Niche guidance: ${nicheMode.guidance}` : "",
      goal ? `Conversion goal: ${goal}` : "",
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()) as {
      hooks: { text?: string; formula?: string; platform?: string; score?: number; patternsUsed?: unknown }[];
    };
    // Server-side whitelist: drop any pattern name the model invented outside the corpus.
    const hooks = parsed.hooks.map((h, i) => {
      const used = Array.isArray(h.patternsUsed)
        ? h.patternsUsed.filter((x): x is string => typeof x === "string" && PATTERN_NAMES.includes(x)).slice(0, 3)
        : [];
      return { ...h, id: `${Date.now()}-${i}`, patternsUsed: used };
    });

    return NextResponse.json({ hooks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed. Check your API key." }, { status: 500 });
  }
}