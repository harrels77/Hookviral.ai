// Client-side plan + free-tier limits.
//
// This is a SIGNAL / incentive layer, not security. Real entitlement
// enforcement requires accounts (Phase 4) + server checks + Stripe — all
// deliberately deferred. Until then nobody is Pro, so isPro() is effectively
// false everywhere; it exists as the single switch to flip once accounts land.

// PRE-MONETIZATION: Stripe is deferred (Phase 4). Until payment exists, gating
// users behind "Pro" features is visual friction that pays off zero — locks,
// upgrade modals and "Pro" chips push toward a purchase flow we don't have.
// So everyone is effectively Pro for now: every consumer conditional checks
// isPro() and unlocks the feature in place.
//
// To re-enable gating when accounts + Stripe land, restore the localStorage
// read below (the rest of the gating code is intact and ready to flip back):
//
//   try { return localStorage.getItem("hv_plan") === "pro"; } catch { return false; }
export function isPro(): boolean {
  return true;
}

// Daily free allowances for the Pro-gated, Claude-heavy actions.
export const FREE_LIMITS = {
  decode: 3, // Trend → Angle decodes / day
} as const;

type LimitKey = keyof typeof FREE_LIMITS;

function midnight(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function read(key: LimitKey): { used: number; resetAt: string } {
  try {
    const raw = localStorage.getItem(`hv_free_${key}`);
    if (raw) {
      const s = JSON.parse(raw) as { used: number; resetAt: string };
      if (new Date() < new Date(s.resetAt)) return s;
    }
  } catch {
    /* ignore */
  }
  return { used: 0, resetAt: midnight() };
}

export function freeRemaining(key: LimitKey): number {
  if (isPro()) return Infinity;
  return Math.max(0, FREE_LIMITS[key] - read(key).used);
}

// Returns true if the action is allowed (and records it), false if the free
// allowance is spent. Pro is always allowed and never counted.
export function consumeFree(key: LimitKey): boolean {
  if (isPro()) return true;
  const s = read(key);
  if (s.used >= FREE_LIMITS[key]) return false;
  try {
    localStorage.setItem(
      `hv_free_${key}`,
      JSON.stringify({ used: s.used + 1, resetAt: s.resetAt })
    );
  } catch {
    /* ignore */
  }
  return true;
}
