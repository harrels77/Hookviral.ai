import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { hook, topic, platform, tone, goal } = await req.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: `You are an expert short-form video scriptwriter in 2026. 
Write a complete 3-part script structure for a ${platform} video.
Respond ONLY with valid JSON, no markdown:
{
  "hook": "the first 3 seconds — exactly the hook text provided, optionally slightly refined",
  "bridge": "seconds 3-10 — one punchy sentence that transitions from the hook to the value. Creates curiosity or tension.",
  "cta": "the call to action — one clear, specific, platform-appropriate CTA. No generic 'follow me'."
}
Keep each part to 1-2 sentences max. Tone: ${tone}. Goal: ${goal}.`,
      messages: [{ role: "user", content: `Hook: "${hook}"\nTopic: "${topic || "general content"}"\nPlatform: ${platform}` }],
    });

    const raw = message.content.filter(b => b.type === "text").map(b => (b as { type: "text"; text: string }).text).join("");
    const script = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json({ script });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Script generation failed." }, { status: 500 });
  }
}