import type { CreditsState } from "@/types";

const KEY = "hv_credits";
const FREE_DAILY = 10;

function getMidnightTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function getCredits(): CreditsState {
  if (typeof window === "undefined")
    return { count: FREE_DAILY, resetAt: getMidnightTomorrow() };
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const fresh = { count: FREE_DAILY, resetAt: getMidnightTomorrow() };
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }
  const state: CreditsState = JSON.parse(raw);
  if (new Date() >= new Date(state.resetAt)) {
    const reset = { count: FREE_DAILY, resetAt: getMidnightTomorrow() };
    localStorage.setItem(KEY, JSON.stringify(reset));
    return reset;
  }
  return state;
}

export function consumeCredit(): CreditsState {
  const state = getCredits();
  const updated = { ...state, count: Math.max(0, state.count - 1) };
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function getTimeUntilReset(): string {
  const state = getCredits();
  const diff = new Date(state.resetAt).getTime() - Date.now();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}
