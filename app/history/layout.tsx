import type { Metadata } from "next";

// History is a personal, localStorage-backed page — nothing to index, and
// without this layout the client page inherited the root canonical ("/").
export const metadata: Metadata = {
  title: "History",
  description: "Your saved HookViral generation sessions, stored locally in your browser.",
  alternates: { canonical: "/history" },
  robots: { index: false, follow: true },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
