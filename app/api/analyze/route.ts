import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { PATTERN_VOCAB, HOOK_PATTERNS } from "@/lib/patterns";
import { getNiche } from "@/lib/niches";
import { extractJson } from "@/lib/parseJson";

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

Also extract the underlying SUBJECT — the 2-6 word topic this hook is *about*, in a form that would make a clean web search query (proper nouns, key event, no conversational filler). Examples:
- Hook: "Personne ne te dira ça mais Mbappé a refusé 80M€ en 2017" → subject: "Mbappé refused 80M PSG 2017"
- Hook: "I tried the viral 5am cold plunge for 30 days" → subject: "5am cold plunge habit"
- Hook: "Wait until you see what Apple just did to the M5" → subject: "Apple M5 chip launch"
If the hook is generic or has no extractable real-world topic (pure lifestyle filler, no proper noun or event), set subject to "". This subject feeds a deep web-research feature, so it must be a real searchable concept.

Respond ONLY with valid JSON, no markdown:
{
  "score": 0-100,
  "formula": "...",
  "subject": "2-6 word searchable topic, or empty string",
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
    const rl = await rateLimit(`analyze:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { hook, platform, niche } = await req.json();
    if (!hook || typeof hook !== "string" || !hook.trim()) {
      return NextResponse.json({ error: "Paste a hook to analyze." }, { status: 400 });
    }

    const n = typeof niche === "string" ? getNiche(niche) : undefined;
    const nicheLine = n
      ? `\nNiche: ${n.label}. Judge it for THIS audience specifically — ${n.guidance}`
      : "";

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Hook: "${hook.slice(0, 300)}"\nPlatform: ${platform || "TikTok"}${nicheLine}`,
        },
      ],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    const analysis = extractJson<{
      subject?: unknown;
      patternsUsed?: unknown;
      patternsMissing?: unknown;
      [k: string]: unknown;
    }>(raw);

    // Keep the taxonomy owned: drop any pattern name not in our corpus.
    const whitelist = (arr: unknown): string[] =>
      Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string" && PATTERN_NAMES.includes(x)) : [];
    analysis.patternsUsed = whitelist(analysis.patternsUsed);
    analysis.patternsMissing = whitelist(analysis.patternsMissing);
    // Subject is optional. Sanitize: trim, cap length, blank if model declined.
    analysis.subject = typeof analysis.subject === "string"
      ? analysis.subject.trim().slice(0, 60)
      : "";

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
