// Platform psychology blocks — injected into generation, analysis, and
// rewriting prompts so the AI judges a hook against the right criteria
// (a TikTok pattern-interrupt scored as a LinkedIn hook would always lose).
//
// Scope is intentionally short-form-only — TikTok, Instagram Reels,
// YouTube Shorts. Reddit / X / LinkedIn / Meta-static would broaden the
// product's positioning from "creator retention suite for short-form" to
// "hook tool for any platform." Deferred until 5-10 short-form creators
// have validated the current loop. See [[project_strategic_state]] in
// memory: features need embedded distribution mechanic to qualify before
// validation.

export interface Platform {
  slug: string;
  label: string;
  emoji: string;
  tagline: string;
  // Injected into system prompts. Multi-line block: Platform name + Core
  // Psychology + Rules. Kept literal so the prompt reads naturally to the
  // model — concise enough not to balloon token budgets.
  guidance: string;
}

export const PLATFORMS: Platform[] = [
  {
    slug: "tiktok",
    label: "TikTok",
    emoji: "🎵",
    tagline: "0-3s retention is everything. Pattern interrupt or die.",
    guidance: `Platform: TikTok (short-form video)
Core Psychology: 0-3 second retention, extreme curiosity, visual anticipation, pattern interrupt. The viewer's thumb is already moving — the hook must stop it before the brain decides to swipe.
Rules:
- Short, punchy, sounds natural when spoken out loud.
- Lean on emotional triggers: FOMO, outrage, hidden-secret framing, massive curiosity.
- If a visual or on-screen text would amplify, suggest it inline (e.g. "[Text on screen: ...]").
- Never sound like an ad. Open mid-action, no greetings, no setup.`,
  },
  {
    slug: "reels",
    label: "Instagram Reels",
    emoji: "📸",
    tagline: "Aspirational + transformation. \"Save this\" energy.",
    guidance: `Platform: Instagram Reels (short-form video)
Core Psychology: Aspirational identity, transformation arcs, "save this for later" intent. Reels viewers come in primed to be inspired AND collect — hooks that promise a concrete shift or a saveable insight outperform pure shock.
Rules:
- Frame around a visible "before → after" or a transformation the viewer can imagine themselves in.
- Trigger save-intent: "the only X you need," "X things I wish I knew," "save this so you don't forget."
- Keep tone confident-positive even when contrarian. Reels skews less cynical than TikTok.
- Visual / aesthetic cue still matters — suggest inline if relevant.`,
  },
  {
    slug: "shorts",
    label: "YouTube Shorts",
    emoji: "▶",
    tagline: "Curiosity loops + educational authority. Think CTR.",
    guidance: `Platform: YouTube Shorts (short-form video)
Core Psychology: High-CTR curiosity loops, tension between a problem and an unexpected/massive result, educational authority framing. Shorts viewers convert into long-form watchers when the hook promises a payoff worth the click.
Rules:
- Open with a clear stakes/promise tension — "I tested X for Y days," "the truth about Z," "why everyone gets X wrong."
- Treat the hook like a YouTube title under 60 chars whenever the format allows — high-stakes promise, no clickbait fluff.
- Lean on numbers and specificity (proven, tested, measured) — Shorts audience values credibility over edginess.
- Open curiosity loops that don't fully close in the hook itself — keep the resolution for the body of the video.`,
  },
];

export function getPlatform(slug: string): Platform | undefined {
  if (!slug) return undefined;
  const q = slug.trim().toLowerCase();
  return PLATFORMS.find(p => p.slug === q || p.label.toLowerCase() === q);
}

export const DEFAULT_PLATFORM_SLUG = "tiktok";

// Convenience: get guidance with safe fallback to the default. Used in
// prompts where we always want SOME platform block in the system prompt,
// even when the caller didn't pass one explicitly.
export function platformGuidance(slug?: string): string {
  const p = (slug && getPlatform(slug)) || getPlatform(DEFAULT_PLATFORM_SLUG);
  return p ? p.guidance : "";
}
