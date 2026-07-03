// Single source of truth for score semantics (DESIGN-SYSTEM.md §3).
// The product's promise IS the score — the same number must read the same
// color on every surface. Before this file, four local scoreColor() copies
// disagreed on thresholds (93/88 vs 93/80 vs 90/78).
export function scoreColor(score: number): string {
  return score >= 85 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)";
}

// Soft background matching the tier — for badges/chips carrying a score.
export function scoreSoft(score: number): string {
  return score >= 85 ? "var(--success-soft)" : score >= 60 ? "var(--warning-soft)" : "var(--danger-soft)";
}
