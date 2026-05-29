import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deep Trend Research — Context, Angles & Scored Hooks",
  description:
    "Research any trending topic with real web sources: who, what, why it's trending, and 3–5 scored content angles with ready-to-use hooks for TikTok, Reels & Shorts. Free for content creators.",
  keywords: [
    "trend research",
    "content angles",
    "trending topic research",
    "video content ideas",
    "viral angle finder",
    "content research tool",
    "trend to content",
    "short form content ideas",
    "faceless content brief",
  ],
  alternates: { canonical: "/trends/research" },
  openGraph: {
    title: "Deep Trend Research — Context, Angles & Scored Hooks",
    description:
      "Real web research on any trend: context plus 3–5 scored content angles with ready-to-use hooks.",
    url: "/trends/research",
  },
};

export default function TrendsResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
