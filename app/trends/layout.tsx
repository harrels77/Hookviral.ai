import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Topics for Short-Form Creators — Live Trend Finder",
  description:
    "Find what's trending right now across Google, Wikipedia, Hacker News, Bluesky, YouTube & Reddit, then turn any trend into scored hooks for TikTok, Reels & Shorts. Free live trend finder for content creators — no account.",
  keywords: [
    "trending topics for creators",
    "trend finder",
    "viral trends",
    "tiktok trends",
    "youtube shorts trends",
    "reels trends",
    "trending video ideas",
    "content ideas from trends",
    "what's trending today",
    "trending topics for tiktok",
    "viral content ideas",
    "trend to hook",
    "short form trends",
    "creator trend tracker",
  ],
  alternates: { canonical: "/trends" },
  openGraph: {
    title: "Trending Topics for Short-Form Creators — Live Trend Finder",
    description:
      "What's trending across Google, Wikipedia, HN, Bluesky, YouTube & Reddit — turned into scored hooks for TikTok, Reels & Shorts.",
    url: "/trends",
  },
};

export default function TrendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
