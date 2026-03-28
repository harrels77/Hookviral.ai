import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

Respond ONLY with valid JSON, no markdown:
{
  "hooks": [
    { "text": "...", "formula": "Curiosity Gap", "platform": "TikTok", "score": 94 }
  ]
}

IMPORTANT: Match the language of the topic input exactly.`;

export async function POST(req: NextRequest) {
  try {
    const { topic, platforms, tone, niche, goal } = await req.json();

    const userMessage = [
      `Topic: "${topic || "general content"}"`,
      `Platform(s): ${(platforms || ["TikTok"]).join(", ")}`,
      `Tone: ${tone || "Authentic"}`,
      niche ? `Niche: ${niche}` : "",
      goal ? `Conversion goal: ${goal}` : "",
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    const hooks = parsed.hooks.map((h: object, i: number) => ({ ...h, id: `${Date.now()}-${i}` }));

    return NextResponse.json({ hooks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed. Check your API key." }, { status: 500 });
  }
}