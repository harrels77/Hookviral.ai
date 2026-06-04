import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Trends", // → "Saved Trends | HookViral AI" via the root title template
  description:
    "Your watch list of trends to research and turn into scored hooks for TikTok, Reels & Shorts. Saved locally, no account.",
  alternates: { canonical: "/saved" },
  // Personal, localStorage-backed page — nothing to index.
  robots: { index: false, follow: true },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
