import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const REWRITE_STYLES = [
  "More emotional",
  "More cinematic",
  "More contrarian",
  "More storytelling",
  "Punchier",
] as const;

const SYSTEM_PROMPT = `You are the world's #1 short-form hook rewriter in 2026. You take a hook the user already wrote and make it stop the scroll in the first 3 seconds, applying the requested style.

RULES:
- Keep the user's core idea and topic — do not invent a different subject.
- Max 18 words. Start with 1 relevant emoji.
- Open a curiosity loop. No clichés ("game-changer", "dive into", "unlock").
- Sound like a real creator, not corporate AI. Match the language of the input hook.

Return 3 distinct rewrites in the requested style.

Respond ONLY with valid JSON, no markdown:
{ "rewrites": ["...", "...", "..."] }`;

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(`rewrite:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { hook, style, platform } = await req.json();
    if (!hook || typeof hook !== "string" || !hook.trim()) {
      return NextResponse.json({ error: "Paste a hook to rewrite." }, { status: 400 });
    }
    const chosen = REWRITE_STYLES.includes(style) ? style : REWRITE_STYLES[0];

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Hook: "${hook.slice(0, 300)}"\nPlatform: ${platform || "TikTok"}\nStyle: ${chosen}`,
        },
      ],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()) as { rewrites?: string[] };
    const rewrites = (parsed.rewrites || []).filter(r => typeof r === "string" && r.trim()).slice(0, 3);

    return NextResponse.json({ rewrites, style: chosen });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Rewrite failed. Please try again." }, { status: 500 });
  }
}
