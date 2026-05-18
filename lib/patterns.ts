// Curated corpus of structural attention patterns for the first 3 seconds of
// short-form video. This is owned taxonomy — the Analyzer maps hooks to THESE
// names so the "why" is consistent and defensible, not invented per call.
// Starts curated; designed to compound with usage later (needs a store).

export interface HookPattern {
  id: string;
  name: string;
  oneLiner: string;
  why: string; // why it holds attention in the first 3 seconds
  example: string;
  fix: string; // how to apply it if a hook is missing it
  faceless: boolean; // especially load-bearing for faceless / narration channels
}

export const HOOK_PATTERNS: HookPattern[] = [
  {
    id: "open-loop",
    name: "Open Loop",
    oneLiner: "Raise a question the viewer must stay to resolve.",
    why: "An unanswered question creates a cognitive itch — the brain resists leaving a loop open, so the viewer keeps watching to close it.",
    example: "🤯 Nobody noticed the detail in this photo for 40 years.",
    fix: "End the hook on tension, not a summary. Withhold the answer the title implies.",
    faceless: true,
  },
  {
    id: "cold-open",
    name: "Cold Open (In Medias Res)",
    oneLiner: "Start mid-action — no greeting, no setup.",
    why: "Skipping the intro removes the 3 seconds where viewers normally swipe. You drop them straight into stakes already in motion.",
    example: "🎬 In 1997 a man vanished. The tape is still unexplained.",
    fix: "Delete 'Hey guys / today I'm going to'. Start on the most charged sentence of the story.",
    faceless: true,
  },
  {
    id: "specificity",
    name: "Concrete Specificity",
    oneLiner: "Exact numbers and details instead of vague claims.",
    why: "Specific figures read as true and earned, not generic AI filler — and a precise number is itself a curiosity trigger ('why 47?').",
    example: "🧪 I tested 47 morning routines and only 1 actually worked.",
    fix: "Replace 'a lot / some / better' with an exact number, timeframe, or amount.",
    faceless: false,
  },
  {
    id: "stakes",
    name: "Stakes",
    oneLiner: "Make clear what's at risk or to be gained.",
    why: "Attention follows consequence. If nothing is gained or lost, the brain classifies it as skippable.",
    example: "⚠️ You're losing $400/month on this without realizing.",
    fix: "Attach a concrete win or loss to the topic — money, time, status, safety.",
    faceless: false,
  },
  {
    id: "pattern-interrupt",
    name: "Pattern Interrupt",
    oneLiner: "Break the rhythm the scroll expects.",
    why: "The feed trains a swipe rhythm. An unexpected first frame or claim halts the thumb before autopilot continues.",
    example: "❌ Stop doing crunches — they're hiding your abs.",
    fix: "Open with the opposite of what the niche always says, or an abrupt visual/claim.",
    faceless: true,
  },
  {
    id: "contradiction",
    name: "Contradiction",
    oneLiner: "Challenge a belief the viewer holds.",
    why: "A claim that conflicts with the viewer's model demands resolution — they stay to see if they're wrong.",
    example: "🤯 Billionaires don't do morning routines like you think.",
    fix: "Name the common belief, then negate it in the same line.",
    faceless: false,
  },
  {
    id: "negativity",
    name: "Negativity / Warning",
    oneLiner: "Frame it as a threat or mistake to avoid.",
    why: "Loss and danger are processed faster than gain — a warning gets attention before the viewer decides to.",
    example: "⚠️ Your morning routine is killing your best hours.",
    fix: "Reframe the benefit as the cost of NOT knowing it.",
    faceless: false,
  },
  {
    id: "implied-payoff",
    name: "Implied Big Payoff",
    oneLiner: "Promise a result clearly worth the watch.",
    why: "Viewers run a fast cost/benefit on every clip. A vivid, believable payoff tips that math toward staying.",
    example: "✨ I automated an entire channel. It made $5k asleep.",
    fix: "Add the concrete outcome the story leads to — keep it believable, not hype.",
    faceless: true,
  },
  {
    id: "knowledge-gap",
    name: "Knowledge Gap",
    oneLiner: "Signal there's a hidden thing they don't know.",
    why: "Implying insider or overlooked information makes not-watching feel like missing out.",
    example: "👀 The real reason your coffee stops working after 20 min.",
    fix: "Use 'the real reason', 'what nobody tells you', 'the part everyone skips' — then deliver it.",
    faceless: true,
  },
];

export function getPattern(id: string): HookPattern | undefined {
  return HOOK_PATTERNS.find(p => p.id === id);
}

// Compact list passed to the model so it maps to our taxonomy, not its own.
export const PATTERN_VOCAB = HOOK_PATTERNS.map(p => `${p.name}: ${p.oneLiner}`).join("\n");
