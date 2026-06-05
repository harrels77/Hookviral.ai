import type { MetadataRoute } from "next";
import { NICHE_MODES } from "@/lib/niches";
import { HOOK_PATTERNS } from "@/lib/patterns";

const SITE_URL = "https://hookviral.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core surfaces — the product loop + flagship landing pages.
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/analyzer", priority: 0.9, changeFrequency: "weekly" },
    { path: "/generator", priority: 0.9, changeFrequency: "weekly" },
    { path: "/trends", priority: 0.8, changeFrequency: "daily" },
    { path: "/tiktok-hook-generator", priority: 0.8, changeFrequency: "weekly" },
    { path: "/youtube-hook-generator", priority: 0.8, changeFrequency: "weekly" },
    { path: "/instagram-hook-generator", priority: 0.8, changeFrequency: "weekly" },
    { path: "/patterns", priority: 0.7, changeFrequency: "monthly" },
    { path: "/why-it-works", priority: 0.6, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  const core: MetadataRoute.Sitemap = staticRoutes.map(r => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Programmatic SEO: one evergreen + one live page per niche.
  const niches: MetadataRoute.Sitemap = NICHE_MODES.flatMap(n => [
    {
      url: `${SITE_URL}/hooks-for/${n.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/trends/${n.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ]);

  // Programmatic SEO: one detail page per owned attention pattern.
  const patterns: MetadataRoute.Sitemap = HOOK_PATTERNS.map(p => ({
    url: `${SITE_URL}/patterns/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...core, ...niches, ...patterns];
}
