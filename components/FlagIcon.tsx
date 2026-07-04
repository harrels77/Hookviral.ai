// Real SVG country flags for the Trends geo row (country-flag-icons).
// Not emoji: flag emojis are banned by DESIGN-SYSTEM.md §5 and, more
// practically, don't render on Windows (users would see raw "US" text).
// Like brand marks, a real-world referent gets its real symbol.
import { US, FR, GB, CA, ES, DE } from "country-flag-icons/react/3x2";
import type { CSSProperties } from "react";

const FLAGS = { US, FR, GB, CA, ES, DE } as const;

export type FlagCode = keyof typeof FLAGS;

export function isFlagCode(code: string): code is FlagCode {
  return code in FLAGS;
}

export function FlagIcon({
  code,
  size = 15,
  style,
}: {
  code: FlagCode;
  size?: number;
  style?: CSSProperties;
}) {
  const F = FLAGS[code];
  return (
    <F
      aria-hidden
      style={{
        width: size,
        height: Math.round(size * (2 / 3)),
        borderRadius: "2px",
        display: "block",
        flexShrink: 0,
        // Hairline so light flag fields (US/FR whites) hold on the light theme
        boxShadow: "inset 0 0 0 .5px rgb(16 16 25 / .18)",
        ...style,
      }}
    />
  );
}
