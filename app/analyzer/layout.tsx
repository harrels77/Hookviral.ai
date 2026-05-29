import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Hook Analyzer — Score Your Video Hook 0–100 for Retention",
  description:
    "Paste any TikTok, Reels or YouTube Shorts hook and get an instant retention score 0–100, the attention patterns it's missing, and a one-click rewrite that stops the scroll in the first 3 seconds. Free AI hook analyzer, no account.",
  keywords: [
    "hook analyzer",
    "hook score",
    "viral hook checker",
    "tiktok hook analyzer",
    "reels hook analyzer",
    "youtube shorts hook analyzer",
    "retention score",
    "scroll stopping hook checker",
    "rate my hook",
    "hook retention test",
    "first 3 seconds analyzer",
    "rewrite hook AI",
    "video hook feedback",
    "improve my hook",
  ],
  alternates: { canonical: "/analyzer" },
  openGraph: {
    title: "Free Hook Analyzer — Score Your Video Hook 0–100 for Retention",
    description:
      "Paste a hook, get an instant retention score, the patterns it's missing, and a stronger rewrite. Free, no account.",
    url: "/analyzer",
  },
};

export default function AnalyzerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
