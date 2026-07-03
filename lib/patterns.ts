// Curated corpus of structural attention patterns for the first 3 seconds of
// short-form video. This is owned taxonomy — the Analyzer maps hooks to THESE
// names so the "why" is consistent and defensible, not invented per call.
// Starts curated; designed to compound with usage later (needs a store).

export interface PatternExample {
  text: string;
  score: number; // illustrative virality score, same 0-100 scale as the Analyzer
  niche: string; // display label — which kind of content this example fits
}

export interface HookPattern {
  id: string;
  name: string;
  oneLiner: string;
  why: string; // why it holds attention in the first 3 seconds
  example: string; // headline example (kept for the hub card + generator deep-link)
  examples: PatternExample[]; // fuller scored set, shown on the /patterns/[id] page
  fix: string; // how to apply it if a hook is missing it
  faceless: boolean; // especially load-bearing for faceless / narration channels
}

export const HOOK_PATTERNS: HookPattern[] = [
  {
    id: "open-loop",
    name: "Open Loop",
    oneLiner: "Raise a question the viewer must stay to resolve.",
    why: "An unanswered question creates a cognitive itch — the brain resists leaving a loop open, so the viewer keeps watching to close it.",
    example: "Nobody noticed the detail in this photo for 40 years.",
    examples: [
      { text: "I followed her account for two years before I realized what she was hiding.", score: 92, niche: "Faceless" },
      { text: "There's a reason your videos die at 3 seconds — and it's not the algorithm.", score: 91, niche: "Creator" },
      { text: "He sold everything and moved abroad. Then the messages started.", score: 93, niche: "Faceless" },
      { text: "She said one sentence in the meeting and the whole deal collapsed.", score: 92, niche: "Business" },
      { text: "The email I almost didn't open changed my entire year.", score: 90, niche: "Motivation" },
    ],
    fix: "End the hook on tension, not a summary. Withhold the answer the title implies.",
    faceless: true,
  },
  {
    id: "cold-open",
    name: "Cold Open (In Medias Res)",
    oneLiner: "Start mid-action — no greeting, no setup.",
    why: "Skipping the intro removes the 3 seconds where viewers normally swipe. You drop them straight into stakes already in motion.",
    example: "In 1997 a man vanished. The tape is still unexplained.",
    examples: [
      { text: "The bank called at 6am. My account was already empty.", score: 93, niche: "Finance" },
      { text: "Three seconds before the buzzer, he did the unthinkable.", score: 92, niche: "Sports" },
      { text: "She opened the box and immediately called the police.", score: 93, niche: "Faceless" },
      { text: "I'm holding the eviction notice as I film this.", score: 90, niche: "Lifestyle" },
      { text: "He'd already deleted every photo by the time she got home.", score: 92, niche: "Faceless" },
    ],
    fix: "Delete 'Hey guys / today I'm going to'. Start on the most charged sentence of the story.",
    faceless: true,
  },
  {
    id: "specificity",
    name: "Concrete Specificity",
    oneLiner: "Exact numbers and details instead of vague claims.",
    why: "Specific figures read as true and earned, not generic AI filler — and a precise number is itself a curiosity trigger ('why 47?').",
    example: "I tested 47 morning routines and only 1 actually worked.",
    examples: [
      { text: "I saved exactly $11,400 in 9 months on a $52k salary.", score: 92, niche: "Finance" },
      { text: "We tried 31 hooks. Number 19 got 2.4M views.", score: 91, niche: "Creator" },
      { text: "3 sets, 8 reps, 1 movement. That's the entire program.", score: 90, niche: "Fitness" },
      { text: "I read 52 books last year. These 4 changed everything.", score: 89, niche: "Motivation" },
      { text: "Day 73 of posting daily — here's exactly what the numbers say.", score: 90, niche: "Business" },
    ],
    fix: "Replace 'a lot / some / better' with an exact number, timeframe, or amount.",
    faceless: false,
  },
  {
    id: "stakes",
    name: "Stakes",
    oneLiner: "Make clear what's at risk or to be gained.",
    why: "Attention follows consequence. If nothing is gained or lost, the brain classifies it as skippable.",
    example: "You're losing $400/month on this without realizing.",
    examples: [
      { text: "One wrong word in your bio is quietly costing you clients.", score: 91, niche: "Business" },
      { text: "Skip this stretch and your knees pay for it at 40.", score: 90, niche: "Fitness" },
      { text: "This one setting leaks your location to every app you open.", score: 92, niche: "Tech" },
      { text: "Miss this window and the trade is gone for a decade.", score: 91, niche: "Finance" },
      { text: "Your first sentence decides whether 90% of viewers stay.", score: 90, niche: "Creator" },
    ],
    fix: "Attach a concrete win or loss to the topic — money, time, status, safety.",
    faceless: false,
  },
  {
    id: "pattern-interrupt",
    name: "Pattern Interrupt",
    oneLiner: "Break the rhythm the scroll expects.",
    why: "The feed trains a swipe rhythm. An unexpected first frame or claim halts the thumb before autopilot continues.",
    example: "Stop doing crunches — they're hiding your abs.",
    examples: [
      { text: "Delete your budgeting app. It's part of why you're broke.", score: 91, niche: "Finance" },
      { text: "Stop journaling every morning. It's keeping you stuck.", score: 90, niche: "Motivation" },
      { text: "Throw out your ring light. Here's what actually matters.", score: 89, niche: "Creator" },
      { text: "Cancel the gym. This costs nothing and works better.", score: 91, niche: "Fitness" },
      { text: "Close every productivity tab. Right now. I'll wait.", score: 90, niche: "Lifestyle" },
    ],
    fix: "Open with the opposite of what the niche always says, or an abrupt visual/claim.",
    faceless: true,
  },
  {
    id: "contradiction",
    name: "Contradiction",
    oneLiner: "Challenge a belief the viewer holds.",
    why: "A claim that conflicts with the viewer's model demands resolution — they stay to see if they're wrong.",
    example: "Billionaires don't do morning routines like you think.",
    examples: [
      { text: "Discipline isn't the answer. It's actually the problem.", score: 90, niche: "Motivation" },
      { text: "More protein isn't building your muscle. This is.", score: 90, niche: "Fitness" },
      { text: "Saving money is quietly making you poorer. Here's how.", score: 91, niche: "Finance" },
      { text: "Posting more is shrinking your reach, not growing it.", score: 90, niche: "Creator" },
      { text: "The 'safe' investment everyone trusts is the riskiest one.", score: 91, niche: "Finance" },
    ],
    fix: "Name the common belief, then negate it in the same line.",
    faceless: false,
  },
  {
    id: "negativity",
    name: "Negativity / Warning",
    oneLiner: "Frame it as a threat or mistake to avoid.",
    why: "Loss and danger are processed faster than gain — a warning gets attention before the viewer decides to.",
    example: "Your morning routine is killing your best hours.",
    examples: [
      { text: "This common habit is quietly wrecking your sleep.", score: 90, niche: "Lifestyle" },
      { text: "The advice in every finance video is actually a trap.", score: 90, niche: "Finance" },
      { text: "Your phone is doing this every night while you sleep.", score: 91, niche: "Tech" },
      { text: "You're training the one muscle that ruins your posture.", score: 89, niche: "Fitness" },
      { text: "That 'harmless' app permission just sold your data.", score: 91, niche: "Tech" },
    ],
    fix: "Reframe the benefit as the cost of NOT knowing it.",
    faceless: false,
  },
  {
    id: "implied-payoff",
    name: "Implied Big Payoff",
    oneLiner: "Promise a result clearly worth the watch.",
    why: "Viewers run a fast cost/benefit on every clip. A vivid, believable payoff tips that math toward staying.",
    example: "I automated an entire channel. It made $5k asleep.",
    examples: [
      { text: "One cold email landed me a $40k contract.", score: 92, niche: "Business" },
      { text: "This 4-minute habit replaced my $200 therapy bill.", score: 91, niche: "Lifestyle" },
      { text: "I turned a single post into 90 days of content.", score: 90, niche: "Creator" },
      { text: "12 weeks, no gym, and this is the result.", score: 91, niche: "Fitness" },
      { text: "I asked AI one question and got back 20 hours a week.", score: 90, niche: "AI Content" },
    ],
    fix: "Add the concrete outcome the story leads to — keep it believable, not hype.",
    faceless: true,
  },
  {
    id: "knowledge-gap",
    name: "Knowledge Gap",
    oneLiner: "Signal there's a hidden thing they don't know.",
    why: "Implying insider or overlooked information makes not-watching feel like missing out.",
    example: "The real reason your coffee stops working after 20 min.",
    examples: [
      { text: "What nobody tells you about your first 1,000 followers.", score: 90, niche: "Creator" },
      { text: "The part of the contract every freelancer skips.", score: 90, niche: "Business" },
      { text: "Here's the one thing your bank hopes you never do.", score: 91, niche: "Finance" },
      { text: "The detail in his form that no coach ever points out.", score: 89, niche: "Fitness" },
      { text: "What actually happens to your brain at 5am.", score: 90, niche: "Motivation" },
    ],
    fix: "Use 'the real reason', 'what nobody tells you', 'the part everyone skips' — then deliver it.",
    faceless: true,
  },
];

export function getPattern(id: string): HookPattern | undefined {
  return HOOK_PATTERNS.find(p => p.id === id);
}

// Deep-link a pattern name to its explanation on the Patterns hub. Single
// definition — was previously copy-pasted in home / analyzer / generator.
export function patternHref(name: string): string {
  const p = HOOK_PATTERNS.find(x => x.name === name);
  return p ? `/patterns#${p.id}` : "/patterns";
}

// Compact list passed to the model so it maps to our taxonomy, not its own.
export const PATTERN_VOCAB = HOOK_PATTERNS.map(p => `${p.name}: ${p.oneLiner}`).join("\n");
