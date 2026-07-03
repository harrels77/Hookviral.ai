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
  Check,
  ChevronDown,
  Clapperboard,
  Clipboard,
  Copy,
  Flame,
  FlaskConical,
  Globe,
  Hash,
  History,
  Lightbulb,
  Link2,
  Lock,
  Megaphone,
  Menu,
  Minus,
  Moon,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Sun,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

export const ICONS = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  chart: BarChart3,
  book: BookOpen,
  bookmark: Bookmark,
  check: Check,
  "chevron-down": ChevronDown,
  clapperboard: Clapperboard,
  clipboard: Clipboard,
  copy: Copy,
  flame: Flame,
  flask: FlaskConical,
  globe: Globe,
  hash: Hash,
  history: History,
  lightbulb: Lightbulb,
  link: Link2,
  lock: Lock,
  megaphone: Megaphone,
  menu: Menu,
  minus: Minus,
  moon: Moon,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  refresh: RefreshCw,
  search: Search,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  target: Target,
  timer: Timer,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  x: X,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;

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
