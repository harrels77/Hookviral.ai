import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/Themeprovider";
import Footer from "./Footer";

// Self-hosted via next/font — no render-blocking @import, no request to
// Google (privacy), no layout shift. Exposed as CSS variables so the
// existing var(--fd)/var(--fb) references keep working.
const syne = Syne({ subsets: ["latin"], variable: "--fd", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--fb", display: "swap" });

const SITE_URL = "https://hookviral.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HookViral AI — Score & Fix Your Video Hooks in Seconds",
    template: "%s | HookViral AI",
  },
  description:
    "Free AI hook generator and analyzer for TikTok, Instagram Reels & YouTube Shorts. Score your opening line 0–100 for retention, see the attention patterns it's missing, and rewrite it to stop the scroll in the first 3 seconds. No account required.",
  applicationName: "HookViral AI",
  category: "technology",
  authors: [{ name: "HookViral" }],
  creator: "HookViral",
  publisher: "HookViral",
  keywords: [
    "hook generator",
    "viral hook generator",
    "AI hook generator",
    "tiktok hook generator",
    "instagram reels hook generator",
    "youtube shorts hook generator",
    "hook analyzer",
    "viral hooks",
    "short form video hooks",
    "scroll stopping hooks",
    "video hook ideas",
    "content hooks",
    "hook ideas for tiktok",
    "retention hooks",
    "first 3 seconds hook",
    "faceless channel hooks",
    "viral video script generator",
    "hook formulas",
    "curiosity gap hook",
    "short form retention",
    "video opening lines",
    "trending topics for creators",
    "content creator tools",
    "AI for content creators",
    "viral content ideas",
    "social media hooks",
    "reels hooks",
    "shorts hooks",
    "hook writing tool",
    "stop the scroll",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "HookViral AI",
    locale: "en_US",
    url: SITE_URL,
    title: "HookViral AI — Score & Fix Your Video Hooks in Seconds",
    description:
      "Free AI hook generator and analyzer for TikTok, Reels & Shorts. Score retention 0–100, find the missing attention patterns, and rewrite to stop the scroll in 3 seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HookViral AI — Score & Fix Your Video Hooks in Seconds",
    description:
      "Free AI hook generator and analyzer for TikTok, Reels & Shorts. Score retention, find missing patterns, rewrite to stop the scroll.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "HookViral",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "HookViral AI",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: "HookViral AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description:
        "Free AI hook generator and analyzer for TikTok, Instagram Reels and YouTube Shorts. Score your hook 0–100 for retention, find missing attention patterns, and rewrite it to stop the scroll in the first 3 seconds.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Nav />
          <main style={{ paddingTop: "var(--nav-h)" }}>
            {children}
          </main>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}