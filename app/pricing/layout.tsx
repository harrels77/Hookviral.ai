import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free & Pro Plans for the Hook Generator & Analyzer",
  description:
    "HookViral pricing. Start free, no account — generate and score hooks for TikTok, Reels & Shorts. Pro removes the daily cap and unlocks unlimited rewrites, trend research and scripts. Same AI on both plans.",
  keywords: [
    "hook generator pricing",
    "viral hook generator free",
    "hook analyzer pricing",
    "free hook generator",
    "content creator tools pricing",
    "tiktok hook generator price",
  ],
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Free & Pro Plans | HookViral AI",
    description:
      "Start free, no account. Pro removes the daily cap and unlocks unlimited rewrites, trend research and scripts.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
