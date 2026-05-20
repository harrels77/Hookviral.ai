import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getNiche } from "@/lib/niches";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are a faceless short-form producer. Given a content angle and its hook, output a production-ready brief a creator with NO camera/face can shoot today (voiceover + stock/B-roll + on-screen text).

Be concrete and specific to the angle — no generic filler. Keep it tight enough for a 30-45s short.

Respond ONLY with valid JSON, no markdown:
{
  "voiceover": ["beat 1 narration line", "beat 2", "beat 3", "beat 4"],
  "broll": ["concrete visual / stock footage idea per beat", "...", "...", "..."],
  "onScreenText": ["punchy on-screen caption per beat", "...", "...", "..."],
  "cta": "one closing call-to-action line"
}

4-5 beats. voiceover/broll/onScreenText arrays must be the same length and aligned beat-by-beat. Match the language of the hook.`;

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`trend-brief:${getClientIp(req)}`, 20, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { angle, hook, niche } = await req.json();
    if (!hook || typeof hook !== "string" || !hook.trim()) {
      return NextResponse.json({ error: "Missing hook." }, { status: 400 });
    }
    const n = typeof niche === "string" ? getNiche(niche) : undefined;
    const audience = n ? `${n.label} faceless creator` : "faceless short-form creator";

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Creator: ${audience}\nAngle: "${String(angle || "").slice(0, 240)}"\nHook: "${hook.slice(0, 240)}"`,
        },
      ],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");
    const p = JSON.parse(raw.replace(/```json|```/g, "").trim()) as {
      voiceover?: string[]; broll?: string[]; onScreenText?: string[]; cta?: string;
    };
    const arr = (x: unknown): string[] =>
      Array.isArray(x) ? x.filter(s => typeof s === "string" && s.trim()).map(s => s.trim()).slice(0, 6) : [];

    return NextResponse.json({
      brief: {
        voiceover: arr(p.voiceover),
        broll: arr(p.broll),
        onScreenText: arr(p.onScreenText),
        cta: typeof p.cta === "string" ? p.cta.trim() : "",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not build the brief." }, { status: 500 });
  }
}
