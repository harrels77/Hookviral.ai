// Thin Apify REST client — sync actor runs only. No npm dependency, just fetch.
// Activates when APIFY_TOKEN is set. Used by trend sources that need scraping
// (TikTok, etc.) where there's no direct public/OAuth API.
//
// Auth convention mirrors the other gated sources (Reddit OAuth, YouTube key):
// when APIFY_TOKEN is missing, runApifyActor throws Error("missing-key") so the
// /api/trends route layer catches it and surfaces configured=false to the UI
// without killing the rest of the multi-source response.

const ENDPOINT = "https://api.apify.com/v2/acts";
const DEFAULT_TIMEOUT_SECS = 120;

export function apifyConfigured(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

// actorId is the "user~actor-name" form Apify uses in URLs (the ~ replaces
// the / from the public actor identifier). Pass it verbatim from the Apify
// Store URL. `input` is the actor-specific input object — each actor documents
// its own schema on its Apify Store page.
export async function runApifyActor<T = unknown>(
  actorId: string,
  input: object,
  opts: { timeoutSecs?: number } = {}
): Promise<T[]> {
  const token = process.env.APIFY_TOKEN;
  // "missing-key" is the sentinel route.ts catches to set configured=false.
  if (!token) throw new Error("missing-key");

  const timeout = opts.timeoutSecs ?? DEFAULT_TIMEOUT_SECS;
  const url = `${ENDPOINT}/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=${timeout}`;

  // No Next fetch cache: actor runs are billed per execution and aren't
  // idempotent in the cache-key sense. Sources layer their own cache on top
  // (Upstash for cross-instance, or a per-instance Map for short windows).
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!res.ok) {
    // Body snippet helps debug from Vercel logs. Token stays in the URL —
    // never echoed in errors or thrown messages.
    const detail = await res.text().catch(() => "");
    throw new Error(
      `apify ${actorId} ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`
    );
  }

  // The sync run-sync-get-dataset-items endpoint returns the dataset items
  // array directly — NOT wrapped in { data: [...] } like most Apify v2 routes.
  const data = (await res.json()) as T[];
  if (!Array.isArray(data)) {
    throw new Error(`apify ${actorId}: expected array, got ${typeof data}`);
  }
  return data;
}
