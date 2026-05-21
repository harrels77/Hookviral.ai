// Robust JSON extractor for Claude responses.
//
// Claude usually returns clean JSON when asked, but sometimes wraps it in
// ```json fences, adds a "Here's the analysis:" intro, or appends a closing
// note. The naive JSON.parse(raw) then throws and the route 500s. This helper
// strips fences, finds the first balanced {…} or […], and parses *that*.
//
// On real failure we throw with a 200-char snippet of the raw response — gives
// us something actionable in Vercel logs instead of a bare SyntaxError.

export function extractJson<T = unknown>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  // Fast path — already clean JSON.
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    /* fall through to balanced-block extraction */
  }

  const start = cleaned.search(/[{[]/);
  if (start === -1) {
    throw new Error(`No JSON in response: ${cleaned.slice(0, 200)}`);
  }
  const open = cleaned[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) {
        return JSON.parse(cleaned.slice(start, i + 1)) as T;
      }
    }
  }
  throw new Error(`Unbalanced JSON in response: ${cleaned.slice(start, start + 200)}`);
}
