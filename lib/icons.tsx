// Canonical icon module (DESIGN-SYSTEM.md §5). The ONLY place lucide-react
// is imported — pages and components go through <Icon name="…"/> so size
// (16 inline / 20 standalone), stroke (1.75) and color (currentColor) stay
// uniform. No emoji anywhere in UI chrome.
import type { CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bookmark,
  Bot,
  Briefcase,
  Check,
  ChevronDown,
  Clapperboard,
  Clipboard,
  Copy,
  Cpu,
  Dumbbell,
  Flame,
  FlaskConical,
  Globe,
  Hash,
  Heart,
  History,
  House,
  Leaf,
  Lightbulb,
  Link2,
  Lock,
  Megaphone,
  Menu,
  Mic,
  Minus,
  Moon,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  X,
  Zap,
} from "lucide-react";

export const ICONS = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  bot: Bot,
  briefcase: Briefcase,
  chart: BarChart3,
  book: BookOpen,
  bookmark: Bookmark,
  check: Check,
  "chevron-down": ChevronDown,
  clapperboard: Clapperboard,
  clipboard: Clipboard,
  copy: Copy,
  cpu: Cpu,
  dumbbell: Dumbbell,
  flame: Flame,
  flask: FlaskConical,
  globe: Globe,
  hash: Hash,
  heart: Heart,
  history: History,
  house: House,
  leaf: Leaf,
  lightbulb: Lightbulb,
  link: Link2,
  lock: Lock,
  megaphone: Megaphone,
  menu: Menu,
  mic: Mic,
  minus: Minus,
  moon: Moon,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  refresh: RefreshCw,
  rocket: Rocket,
  search: Search,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  target: Target,
  timer: Timer,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  trophy: Trophy,
  wallet: Wallet,
  x: X,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;

// Niche → icon. Replaces the emoji field that used to decorate niche chips
// and SEO heroes (DESIGN-SYSTEM.md §5: Lucide only, no emoji chrome).
export const NICHE_ICONS: Record<string, IconName> = {
  fitness: "dumbbell",
  finance: "wallet",
  tech: "cpu",
  business: "briefcase",
  motivation: "rocket",
  faceless: "mic",
  relationships: "heart",
  lifestyle: "leaf",
  sports: "trophy",
  "ai-content": "bot",
};

export function nicheIcon(slug: string): IconName {
  return NICHE_ICONS[slug] ?? "sparkles";
}

export function Icon({
  name,
  size = 16,
  className,
  style,
  fill,
  label,
}: {
  name: IconName;
  size?: 16 | 20;
  className?: string;
  style?: CSSProperties;
  /** Fill the glyph (Star saved-state). Defaults to none. */
  fill?: string;
  /** Accessible label when the icon stands alone; omit when decorative. */
  label?: string;
}) {
  const C = ICONS[name];
  return (
    <C
      size={size}
      strokeWidth={1.75}
      fill={fill ?? "none"}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      style={{ flexShrink: 0, verticalAlign: "-2px", ...style }}
    />
  );
}
