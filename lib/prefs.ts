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
