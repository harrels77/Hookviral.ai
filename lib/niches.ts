export interface NicheMode {
  slug: string;
  label: string;
  emoji: string;
  tagline: string;
  // Injected into the generation prompt so hooks land for this audience.
  guidance: string;
  sampleTopics: string[];
  exampleHooks: { text: string; formula: string; score: number }[];
}

export const NICHE_MODES: NicheMode[] = [
  {
    slug: "fitness",
    label: "Fitness",
    emoji: "💪",
    tagline: "Hooks that stop the scroll for workout, nutrition & transformation content.",
    guidance:
      "Fitness viewers reward visible stakes and contrarian truths. Lead with a result, a mistake everyone makes, or a body-related fear. Avoid generic motivation.",
    sampleTopics: ["My 90-day transformation", "Why your abs aren't showing", "The only 3 exercises you need"],
    exampleHooks: [
      { text: "🔥 I lost 15kg doing this 10-min routine. No gym.", formula: "Story Starter", score: 96 },
      { text: "⚠️ Stop doing crunches — they're hiding your abs.", formula: "Contrarian", score: 94 },
      { text: "🤯 The recovery trick trainers never tell beginners.", formula: "Curiosity Gap", score: 92 },
    ],
  },
  {
    slug: "finance",
    label: "Finance",
    emoji: "💸",
    tagline: "Hooks for money, investing & saving content that actually gets watched.",
    guidance:
      "Finance viewers respond to loss aversion and specific numbers. Use concrete dollar amounts and the cost of inaction. Sound credible, not hypey.",
    sampleTopics: ["How I saved $10k in a year", "The tax mistake costing you thousands", "Investing myths"],
    exampleHooks: [
      { text: "💸 You're losing $400/month on this without realizing.", formula: "Loss Aversion", score: 95 },
      { text: "🤯 I saved $10,000 in a year changing one habit.", formula: "Story Starter", score: 93 },
      { text: "❌ The budgeting advice everyone gives is wrong.", formula: "Contrarian", score: 91 },
    ],
  },
  {
    slug: "tech",
    label: "Tech",
    emoji: "🤖",
    tagline: "Hooks for AI, gadgets & software content built for short-form.",
    guidance:
      "Tech viewers want speed and an edge. Lead with what they're missing, a tool nobody uses yet, or a counterintuitive take on hype.",
    sampleTopics: ["AI tools nobody is using", "Why your setup is slow", "The app that replaced 5 others"],
    exampleHooks: [
      { text: "🤖 This free AI tool replaces 5 apps you pay for.", formula: "Number + Promise", score: 95 },
      { text: "👀 Everyone uses ChatGPT wrong. Here's the fix.", formula: "Contrarian", score: 93 },
      { text: "⚠️ Your phone is leaking this every single day.", formula: "Loss Aversion", score: 92 },
    ],
  },
  {
    slug: "business",
    label: "Business",
    emoji: "📈",
    tagline: "Hooks for entrepreneurship, marketing & startup content.",
    guidance:
      "Business viewers want leverage and proof. Lead with a result, a costly mistake, or an insider truth that contradicts common advice.",
    sampleTopics: ["How I got my first 100 customers", "Why your offer doesn't sell", "Marketing that actually works"],
    exampleHooks: [
      { text: "📈 I got 100 customers with zero ad spend. Here's how.", formula: "Story Starter", score: 95 },
      { text: "❌ Your offer doesn't sell because of this one line.", formula: "Curiosity Gap", score: 93 },
      { text: "🤯 The pricing mistake killing 90% of new businesses.", formula: "Shock Value", score: 92 },
    ],
  },
  {
    slug: "motivation",
    label: "Motivation",
    emoji: "🧠",
    tagline: "Hooks for mindset & discipline content that doesn't feel cheesy.",
    guidance:
      "Motivation viewers are numb to clichés. Use raw, specific confession and contrarian framing instead of generic inspiration.",
    sampleTopics: ["How I beat procrastination", "Discipline over motivation", "What changed everything for me"],
    exampleHooks: [
      { text: "🧠 I deleted my to-do list for 30 days. Output doubled.", formula: "Story Starter", score: 96 },
      { text: "⚠️ Your morning routine is killing your best hours.", formula: "Loss Aversion", score: 93 },
      { text: "❌ Motivation is a lie. Do this instead.", formula: "Contrarian", score: 92 },
    ],
  },
  {
    slug: "faceless",
    label: "Faceless Storytelling",
    emoji: "🎬",
    tagline: "Hooks for faceless narration & story-driven short-form channels.",
    guidance:
      "Faceless channels live or die on the opening line. Open mid-story with implied stakes and a clear unanswered question. No greetings, no setup.",
    sampleTopics: ["A story nobody believes", "The disappearance no one solved", "What he found changed everything"],
    exampleHooks: [
      { text: "🎬 In 1997 a man vanished. The tape is still unexplained.", formula: "Story Starter", score: 96 },
      { text: "👀 Nobody noticed the detail in this photo for 40 years.", formula: "Curiosity Gap", score: 94 },
      { text: "🤯 This 12-second clip ended an entire industry.", formula: "Shock Value", score: 93 },
    ],
  },
  {
    slug: "relationships",
    label: "Relationships",
    emoji: "💕",
    tagline: "Hooks for dating, relationships & breakup content — incl. faceless / AI-presenter podcasts.",
    guidance:
      "Relationship viewers reward raw relatability and a strong point of view on dating, breakups, and modern romance. Lead with a confession that mirrors the viewer's own experience, a 'nobody talks about this' truth, or a polarizing take that forces them to pick a side. Specificity and an opinion that risks disagreement beat safe advice. Works for talk/podcast-style and AI-presenter formats.",
    sampleTopics: ["Why situationships always end the same way", "Red flags everyone excuses", "The dating advice nobody asked for"],
    exampleHooks: [
      { text: "💕 He's not confusing. You're just not his priority.", formula: "Relatable Confession", score: 95 },
      { text: "🚩 The green flag most people mistake for boring.", formula: "Contrarian", score: 93 },
      { text: "👀 Nobody warns you about year 3 of a relationship.", formula: "Curiosity Gap", score: 92 },
    ],
  },
  {
    slug: "lifestyle",
    label: "Lifestyle",
    emoji: "🌿",
    tagline: "Hooks for routine, wellness & aesthetic daily-life content.",
    guidance:
      "Lifestyle viewers reward aspiration grounded in something real — a habit, a routine, an aesthetic, a mindset shift they can copy. Lead with a transformation, an 'I tried X for Y days' arc, or a contrarian take on a wellness/productivity norm. Avoid vague inspiration; show the specific change and the result. Strong save-this intent.",
    sampleTopics: ["My 5am routine that actually changed things", "Habits I quit to feel better", "The aesthetic nobody can afford"],
    exampleHooks: [
      { text: "🌿 I quit 3 'healthy' habits and finally slept through the night.", formula: "Contrarian", score: 94 },
      { text: "✨ The 10-minute routine that replaced my $200 therapy bill.", formula: "Number + Promise", score: 93 },
      { text: "👀 Nobody tells you how lonely 'glowing up' actually feels.", formula: "Relatable Confession", score: 92 },
    ],
  },
  {
    slug: "sports",
    label: "Sports",
    emoji: "🏆",
    tagline: "Hooks for sports edits, hot takes & highlight content.",
    guidance:
      "Sports fans react to bold takes and stakes between players/teams. Lead with a hot opinion, an underrated athlete, a record, or a 'nobody talks about' angle. Works across football, basketball, combat sports, etc.",
    sampleTopics: ["The most underrated athlete ever", "Why this trade makes no sense", "The play that broke records"],
    exampleHooks: [
      { text: "🏆 The most underrated athlete of his generation. No debate.", formula: "Contrarian", score: 95 },
      { text: "🤯 Nobody talks about what he did in the last 2 minutes.", formula: "Curiosity Gap", score: 93 },
      { text: "❌ This trade makes zero sense — and here's why.", formula: "Contrarian", score: 92 },
    ],
  },
  {
    slug: "ai-content",
    label: "AI Content",
    emoji: "✨",
    tagline: "Hooks for AI-generated & automation content channels.",
    guidance:
      "AI-content viewers want the edge before everyone else. Lead with a workflow nobody knows, a result that seems impossible, or hype contradiction.",
    sampleTopics: ["I automated my whole channel", "AI faceless workflow", "This made $5k while I slept"],
    exampleHooks: [
      { text: "✨ I automated an entire channel. It made $5k asleep.", formula: "Story Starter", score: 96 },
      { text: "🤖 This AI workflow nobody is using yet prints content.", formula: "Curiosity Gap", score: 94 },
      { text: "⚠️ You're using AI video tools completely wrong.", formula: "Contrarian", score: 92 },
    ],
  },
];

export function getNiche(slug: string): NicheMode | undefined {
  return NICHE_MODES.find(n => n.slug === slug);
}

export function matchNiche(input: string): NicheMode | undefined {
  if (!input) return undefined;
  const q = input.trim().toLowerCase();
  return NICHE_MODES.find(
    n => n.slug === q || n.label.toLowerCase() === q
  );
}
