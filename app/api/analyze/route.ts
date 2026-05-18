import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PATTERN_NAMES = HOOK_PATTERNS.map(p => p.name);

const SYSTEM_PROMPT = `You are the world's #1 viral retention analyst in 2026. You judge whether a short-form hook stops the scroll in the first 3 seconds.

You receive ONE hook the user already wrote. Analyze it honestly — do NOT rewrite it. Be specific and critical; a generic hook should score low.

Scoring (0-100, how likely it stops the scroll in 3s):
- 95-99: Would stop 9/10 scrollers
- 90-94: Strong, proven formula executed well
- 80-89: Decent but a sharper version exists
- 60-79: Weak — buried lead, no open loop, or generic
- below 60: Would be scrolled past

Sub-scores are 0-10 integers:
- curiosity: does it open a loop the viewer must close?
- emotion: does it hit a real feeling (fear, desire, surprise, validation)?
- clarity: is it instantly understandable, no fluff before the payload?

Identify which viral formula (if any) the hook uses: Curiosity Gap, Loss Aversion, Story Starter, Shock Value, Number + Promise, Contrarian Statement, Relatable Confession, Visual / Movement, or "None".

ATTENTION PATTERNS — use ONLY these exact names, never invent your own:
${PATTERN_VOCAB}

Decide which of these patterns the hook already uses (patternsUsed) and which 1-3 high-leverage ones it is missing and would benefit most from (patternsMissing). Use the exact names above verbatim.

Respond ONLY with valid JSON, no markdown:
{
  "score": 0-100,
  "formula": "...",
  "why": "2-3 sentences: the single biggest reason it works or fails, in plain creator language",
  "curiosity": 0-10,
  "emotion": 0-10,
  "clarity": 0-10,
  "weakPoints": ["concrete, actionable weakness 1", "weakness 2"],
  "patternsUsed": ["exact pattern name", ...],
  "patternsMissing": ["exact pattern name", ...]
}

If the hook is already excellent, weakPoints can be an empty array. Match the language of the hook.`;

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(`analyze:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { hook, platform } = await req.json();
    if (!hook || typeof hook !== "string" || !hook.trim()) {
      return NextResponse.json({ error: "Paste a hook to analyze." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Hook: "${hook.slice(0, 300)}"\nPlatform: ${platform || "TikTok"}`,
        },
      ],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    const analysis = JSON.parse(raw.replace(/```json|```/g, "").trim());

    // Keep the taxonomy owned: drop any pattern name not in our corpus.
    const whitelist = (arr: unknown): string[] =>
      Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string" && PATTERN_NAMES.includes(x)) : [];
    analysis.patternsUsed = whitelist(analysis.patternsUsed);
    analysis.patternsMissing = whitelist(analysis.patternsMissing);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
