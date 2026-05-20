// Bold geometric letterforms: H (electric purple) + V (hot pink).
// No badge/container — pure shapes, inspired by editorial logo mark style.
export function Logo({ size = 28 }: { size?: number }) {
  const w = Math.round(size * 1.65); // natural 66:40 aspect ratio
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 66 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HookViral"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* H — electric purple */}
      <rect x="0"  y="0"  width="7"  height="40" fill="#6C3AFF" />
      <rect x="23" y="0"  width="7"  height="40" fill="#6C3AFF" />
      <rect x="0"  y="16" width="30" height="8"  fill="#6C3AFF" />
      {/* V — hot pink, two converging bars meeting at bottom center */}
      <polygon points="36,0 43,0 51,40 44,40" fill="#FF2D6B" />
      <polygon points="59,0 66,0 58,40 51,40" fill="#FF2D6B" />
    </svg>
  );
}
