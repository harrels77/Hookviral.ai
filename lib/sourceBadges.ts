// Source badge metadata (emoji + label + brand color) for trend cards. Pure
// data with no deps, so it can be imported by client pages (Trends, Saved)
// without pulling in lib/trends.ts's server-side Anthropic import.
export type SourceKey =
  | "google" | "youtube" | "reddit" | "wikipedia" | "hackernews"
  | "bluesky" | "tiktok" | "twitter" | "instagram";

export const SOURCE_BADGES: Record<SourceKey, { emoji: string; label: string; color: string }> = {
  google:     { emoji: "🔎", label: "Google",      color: "#5BA8FF" },
  youtube:    { emoji: "▶",  label: "YouTube",     color: "#FF4D5A" },
  reddit:     { emoji: "🟠", label: "Reddit",      color: "#FF8B4A" },
  wikipedia:  { emoji: "📚", label: "Wikipedia",   color: "#9CA3AF" },
  hackernews: { emoji: "🟧", label: "Hacker News", color: "#FF6600" },
  bluesky:    { emoji: "🦋", label: "Bluesky",     color: "#0085FF" },
  tiktok:     { emoji: "🎵", label: "TikTok",      color: "#FE2C55" },
  twitter:    { emoji: "𝕏",  label: "X",           color: "#1DA1F2" },
  instagram:  { emoji: "📸", label: "Instagram",   color: "#E1306C" },
};
