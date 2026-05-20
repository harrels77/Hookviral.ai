// Thin Upstash Redis REST client — no npm dependency, just fetch.
// Activates when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
// Used by both the durable rate limiter and the email capture endpoint.

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function upstashConfigured(): boolean {
  return Boolean(URL && TOKEN);
}

type Command = (string | number)[];

async function call(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  return res.json();
}

// Single command, e.g. command(["SADD", "key", "value"]) → result
export async function command<T = unknown>(cmd: Command): Promise<T> {
  const data = (await call("", cmd)) as { result: T };
  return data.result;
}

// Pipeline of commands → array of results in order
export async function pipeline(cmds: Command[]): Promise<unknown[]> {
  const data = (await call("/pipeline", cmds)) as { result: unknown }[];
  return data.map(d => d.result);
}
