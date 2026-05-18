// Brand mark: "HV" monogram on the hot->electric gradient badge.
// SVG so it stays crisp at any size and reuses the exact site palette.
export function Logo({ size = 28 }: { size?: number }) {
  const gid = "hv-logo-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HookViral"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF2D6B" />
          <stop offset="1" stopColor="#6C3AFF" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="9" fill={`url(#${gid})`} />
      <text
        x="18"
        y="19"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "15px", letterSpacing: "-1px" }}
      >
        HV
      </text>
    </svg>
  );
}
