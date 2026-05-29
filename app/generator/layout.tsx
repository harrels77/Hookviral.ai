import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Viral Hook Generator — 8 Scored Hooks per Idea",
  description:
    "Turn any topic into 8 viral hooks built for TikTok, Instagram Reels & YouTube Shorts. Each hook is scored 0–100 for scroll-stopping retention and tagged with the attention pattern it uses. Free AI hook generator, no account required.",
  keywords: [
    "hook generator",
    "viral hook generator",
    "AI hook generator",
    "tiktok hook generator",
    "instagram reels hook generator",
    "youtube shorts hook generator",
    "free hook generator",
    "video hook ideas",
    "content hook generator",
    "hook ideas generator",
    "viral video hooks",
    "short form hook generator",
    "faceless channel hooks",
    "hook formulas",
    "video opening line generator",
  ],
  alternates: { canonical: "/generator" },
  openGraph: {
    title: "Free Viral Hook Generator — 8 Scored Hooks per Idea",
    description:
      "Turn any topic into 8 scored, scroll-stopping hooks for TikTok, Reels & Shorts. Free, no account.",
    url: "/generator",
  },
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
