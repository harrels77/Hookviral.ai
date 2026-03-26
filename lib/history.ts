import type { Session, Hook } from "@/types";

const HIST_KEY = "hv_hist";
const FAV_KEY = "hv_favs";

export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
}

export function saveSession(session: Session): void {
  const all = getSessions();
  all.unshift(session);
  if (all.length > 60) all.pop();
  localStorage.setItem(HIST_KEY, JSON.stringify(all));
}

export function getFavorites(): Hook[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
}

export function toggleFavorite(hook: Hook): boolean {
  const favs = getFavorites();
  const idx = favs.findIndex((f) => f.id === hook.id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    return false;
  }
  favs.push(hook);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return true;
}