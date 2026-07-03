// Official brand marks for the external platforms the product talks about
// (trend sources, short-form platforms). Nominative use — monochrome SVG
// paths from simple-icons, tinted via currentColor so each surface decides
// the brand color (SOURCE_BADGES.color) or inherits text color.
// This is the ONE sanctioned exception to "Lucide only" (DESIGN-SYSTEM.md §5):
// a third-party platform is named by its own mark, never by an emoji.
import type { CSSProperties } from "react";
import {
  siBluesky,
  siGoogle,
  siInstagram,
  siReddit,
  siTiktok,
  siWikipedia,
  siX,
  siYcombinator,
  siYoutube,
} from "simple-icons";

const BRANDS = {
  google: siGoogle,
  youtube: siYoutube,
  reddit: siReddit,
  wikipedia: siWikipedia,
  hackernews: siYcombinator,
  bluesky: siBluesky,
  tiktok: siTiktok,
  instagram: siInstagram,
  twitter: siX,
} as const;

export type BrandName = keyof typeof BRANDS;

// Short-form platform slug (lib/platforms.ts) → brand mark.
export const PLATFORM_BRAND: Record<string, BrandName> = {
  tiktok: "tiktok",
  reels: "instagram",
  shorts: "youtube",
};

export function BrandIcon({
  name,
  size = 14,
  style,
  label,
}: {
  name: BrandName;
  size?: number;
  style?: CSSProperties;
  /** Accessible label when the mark stands alone; omit when decorative. */
  label?: string;
}) {
  const icon = BRANDS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      style={{ flexShrink: 0, ...style }}
    >
      <path d={icon.path} />
    </svg>
  );
}
