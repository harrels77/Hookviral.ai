# ⚡ HookViral AI

**Generate 8 viral hooks + hashtags + scripts in 3 seconds.**  
Built for content creators who want to stop the scroll — not guess at it.

---

## What is HookViral AI?

HookViral AI is a freemium SaaS that uses Claude AI to generate platform-optimized viral hooks for TikTok, Instagram, YouTube, LinkedIn, and X. Each hook comes with a virality score, optimized hashtags, and an optional script (Pro).

**The problem it solves:** Creators waste 15-30 minutes per video trying to write the opening hook. HookViral generates 8 options in under 10 seconds.

---

## Features

| Feature | Free | Pro ($12/mo) | Agency ($49/mo) |
|---|---|---|---|
| Hook generations | 10/day | Unlimited | Unlimited |
| Platforms | 5 | 5 | 5 |
| Viral formulas | 8 | 8 | 8 |
| Virality score | Basic | Advanced + breakdown | Advanced + breakdown |
| Hashtag generator | ✓ | ✓ | ✓ |
| Script generator | — | ✓ | ✓ |
| History | Session | Unlimited | Unlimited |
| Export .txt | — | ✓ | ✓ |
| Multi-client workspace | — | — | ✓ |
| API access | — | — | ✓ |
| Bulk (50 hooks) | — | — | ✓ |
| White-label | — | — | ✓ |

---

## Tech Stack

```
Frontend:     Next.js 15 (App Router) + TypeScript
Styling:      Inline styles + CSS variables (no Tailwind)
AI:           Anthropic Claude claude-sonnet-4-5 via @anthropic-ai/sdk
Payments:     Stripe (to be connected)
Storage:      localStorage (free tier) + Supabase (paid - to be connected)
Deployment:   Vercel
```

**Monthly cost at launch:** $0 (Vercel free tier + Anthropic API pay-per-use ~$0.01/generation)

---

## Project Structure

```
hookviral/
├── app/
│   ├── page.tsx                    ← Landing page
│   ├── layout.tsx                  ← Root layout + Nav
│   ├── globals.css                 ← CSS variables + animations
│   ├── generator/
│   │   └── page.tsx                ← Main generator UI
│   ├── history/
│   │   └── page.tsx                ← History + favorites + search
│   ├── pricing/
│   │   └── page.tsx                ← Pricing + FAQ
│   ├── terms/
│   │   └── page.tsx                ← Terms of Service
│   ├── privacy/
│   │   └── page.tsx                ← Privacy Policy
│   └── api/
│       ├── generate/
│       │   └── route.ts            ← Claude API: hook generation
│       └── script/
│           └── route.ts            ← Claude API: script generation
├── components/
│   └── Nav.tsx                     ← Navigation (desktop + mobile)
├── lib/
│   ├── credits.ts                  ← Credits system with midnight reset
│   ├── history.ts                  ← localStorage history manager
│   └── prompt.ts                   ← Claude system prompts
├── types/
│   └── index.ts                    ← TypeScript interfaces
├── .env.local                      ← Your API keys (never commit this)
├── .env.local.example              ← Template for env variables
└── README.md                       ← This file
```

---

## Getting Started

### 1. Prerequisites

- Node.js 20+ → download at [nodejs.org](https://nodejs.org)
- A free Anthropic API key → [console.anthropic.com](https://console.anthropic.com)
- VS Code (recommended)

### 2. Install

```bash
# Clone or download the project
cd Desktop
npx create-next-app@latest hookviral --typescript --eslint --app --no-tailwind --no-src-dir
cd hookviral
npm install @anthropic-ai/sdk
```

Copy all project files into the created folder (replacing the defaults).

### 3. Set up environment variables

Create a file called `.env.local` at the project root:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

⚠️ Never commit `.env.local` to GitHub. It's already in `.gitignore`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hookviral.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Add environment variable: `ANTHROPIC_API_KEY` = your key
3. Click Deploy → Your site is live in ~2 minutes 🚀

---

## Adding Stripe Payments

When you're ready to charge users:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create two products: Pro ($12/mo) and Agency ($49/mo)
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
4. Replace the `alert()` calls in the upgrade modal and pricing page buttons with Stripe Checkout

---

## The AI Prompt Strategy

The system prompt is built for quality, not just output. Key principles:

- **Platform-specific psychology**: TikTok = pattern interrupts, LinkedIn = authority, etc.
- **8 distinct formulas**: Each used once per generation for variety
- **Quality rules**: No clichés, no corporate tone, human voice
- **Hashtag optimization**: Platform-native mix of high/mid/micro volume
- **Analysis output**: Why the hook works + score breakdown per dimension

---

## Revenue Model

Target: **$5,000/month by month 6**

```
200 Pro users × $12    = $2,400/mo
30 Agency users × $49  = $1,470/mo  
15 annual prepaid       = $1,200/mo
─────────────────────────────────────
Total                   = $5,070/mo
```

**Growth channels:**
- Product Hunt launch (Tuesday)
- TikTok/Reels: "I generated 8 viral hooks in 3 seconds" demo videos
- Reddit: r/TikTok, r/socialmedia, r/Entrepreneur
- SEO pages: /tiktok-hook-generator, /instagram-hook-generator

---

## Roadmap

- [x] Hook generator with 8 formulas
- [x] Virality scoring
- [x] Hashtag generator
- [x] Script builder (Pro)
- [x] Analysis breakdown (Pro)
- [x] History + favorites + search
- [x] Mobile-responsive nav with hamburger
- [ ] Stripe payments integration
- [ ] Supabase auth + cloud sync
- [ ] A/B hook testing
- [ ] Caption generator
- [ ] Email digest ("Your top 3 hooks this week")
- [ ] API documentation for Agency tier

---

## Support

- **General:** hello@hookviral.ai  
- **Privacy:** privacy@hookviral.ai  
- **Legal:** legal@hookviral.ai

---

Built with ⚡ by [Your Name] · [hookviral.ai](https://hookviral.ai)