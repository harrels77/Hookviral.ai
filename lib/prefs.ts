// Cross-page preferences kept in localStorage. The product remembers your
// niche + geo across Trends, Analyzer, Generator — small, but it's what
// separates a tool that feels premium from one that feels generic.

function read(key: string): string {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}

function write(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch { /* ignore */ }
}

export const getNichePref = () => read("hv_niche");
export const setNichePref = (slug: string) => write("hv_niche", slug);

export const getGeoPref = () => read("hv_geo");
export const setGeoPref = (code: string) => write("hv_geo", code);

// Sources are persisted as a CSV ("google,youtube,reddit"). Empty value =
// fall back to defaults at the call site; we never write the empty string.
export const getSourcesPref = () => read("hv_sources");
export const setSourcesPref = (csv: string) => write("hv_sources", csv);

// ── Saved trends (the "watch list") ──────────────────────────────────────
// Distinct from History (what you've *created*): Saved = trends you're
// tracking to act on later. JSON array under "hv_saved_trends"; id =
// title.toLowerCase() so the same headline from any source de-dupes + toggles.
export interface SavedTrend {
  id: string;       // title.toLowerCase() — stable across sources/sessions
  title: string;
  source: string;   // badge key (google/bluesky/…), "" if the trend had none
  url: string;      // deep link to act on it (the research page for this trend)
  savedAt: number;  // epoch ms
}

const SAVED_KEY = "hv_saved_trends";

function readSaved(): SavedTrend[] {
  try {
    const arr = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}
function writeSaved(list: SavedTrend[]) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export const trendId = (title: string) => title.trim().toLowerCase();

export const getSavedTrends = (): SavedTrend[] =>
  readSaved().sort((a, b) => b.savedAt - a.savedAt);          // newest first

export const isTrendSaved = (id: string): boolean =>
  readSaved().some(t => t.id === id);

export function saveTrend(t: { id: string; title: string; source: string; url: string }): void {
  const list = readSaved();
  if (list.some(x => x.id === t.id)) return;                  // already saved — no dupes
  list.push({ ...t, savedAt: Date.now() });
  writeSaved(list);
}

export const unsaveTrend = (id: string): void =>
  writeSaved(readSaved().filter(t => t.id !== id));
