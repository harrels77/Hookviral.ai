import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { HOOK_PATTERNS } from "@/lib/patterns";
import { platformGuidance } from "@/lib/platforms";
import { extractJson } from "@/lib/parseJson";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const REWRITE_STYLES = [
  "More emotional",
  "More cinematic",
  "More contrarian",
  "More storytelling",
  "Punchier",
] as const;

// System prompt is built per call so the platform psychology block reflects
// the target platform. "More cinematic" on TikTok ≠ "More cinematic" on
// Reels — the same style instruction lands differently when the audience
// reflex changes.
function buildSystemPrompt(platformBlock: string): string {
  return `You are the world's #1 short-form hook rewriter in 2026. You take a hook the user already wrote and make it stop the scroll in the first 3 seconds, applying the requested transformation (a style OR a specific attention pattern to inject).

PLATFORM PSYCHOLOGY (rewrites must respect this — the style means different things per platform)
${platformBlock}

RULES:
- Keep the user's core idea and topic — do not invent a different subject.
- Max 18 words. Start with 1 relevant emoji.
- Open a curiosity loop. No clichés ("game-changer", "dive into", "unlock").
- Sound like a real creator, not corporate AI. Match the language of the input hook.

Return 3 distinct rewrites in the requested style. For each, give an honest retention score (0-100) on the same scale a top viral analyst would use — likelihood it stops the scroll in 3 seconds. Do not inflate; a mediocre rewrite scores in the 70s.

Respond ONLY with valid JSON, no markdown:
{ "rewrites": [{ "text": "...", "score": 0-100 }, { "text": "...", "score": 0-100 }, { "text": "...", "score": 0-100 }] }`;
}

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`rewrite:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { hook, style, platform, pattern } = await req.json();
    if (!hook || typeof hook !== "string" || !hook.trim()) {
      return NextResponse.json({ error: "Paste a hook to rewrite." }, { status: 400 });
    }

    // Pattern-targeted rewrite takes priority: rewrite to inject ONE missing
    // attention pattern from our owned taxonomy (grounded in its fix).
    const target = typeof pattern === "string"
      ? HOOK_PATTERNS.find(p => p.name === pattern)
      : undefined;
    const chosen = REWRITE_STYLES.includes(style) ? style : REWRITE_STYLES[0];

    const instruction = target
      ? `Target pattern to inject: "${target.name}" — ${target.oneLiner}\nHow to apply it: ${target.fix}\nRewrite the hook so this pattern is unmistakably present, without losing the original topic.`
      : `Style: ${chosen}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: buildSystemPrompt(platformGuidance(typeof platform === "string" ? platform : undefined)),
      messages: [
        {
          role: "user",
          content: `Hook: "${hook.slice(0, 300)}"\nPlatform: ${platform || "TikTok"}\n${instruction}`,
        },
      ],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");
    // extractJson is resilient to preamble/fences — was the fragile
    // JSON.parse(raw.replace(...)) chain before, which 500'd on any prose
    // wrapping. Same dette technique flagged for the other routes.
    const parsed = extractJson<{
      rewrites?: { text?: string; score?: number }[];
    }>(raw);
    const rewrites = (parsed.rewrites || [])
      .filter(r => r && typeof r.text === "string" && r.text.trim())
      .slice(0, 3)
      .map(r => ({
        text: r.text!.trim(),
        score: Math.max(0, Math.min(100, Math.round(Number(r.score) || 0))),
      }));

    return NextResponse.json({ rewrites, style: target ? null : chosen, pattern: target?.name || null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Rewrite failed. Please try again." }, { status: 500 });
  }
}
