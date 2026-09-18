import * as schema from "./schema";

export const isCloudflareD1Configured = (): boolean => {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_API_TOKEN &&
    process.env.CLOUDFLARE_D1_DATABASE_ID
  );
};

/**
 * Executes a raw SQL query against Cloudflare D1 via the Cloudflare REST API.
 * Works seamlessly inside Vercel Serverless Node.js runtime.
 */
export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error("Cloudflare D1 credentials are not configured.");
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql,
      params,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudflare D1 Query Failed (${res.status}): ${errText}`);
  }

  const json = (await res.json()) as {
    success: boolean;
    errors?: { message: string }[];
    result?: { results: T[] }[];
  };

  if (!json.success && json.errors?.length) {
    throw new Error(`Cloudflare D1 Error: ${json.errors[0].message}`);
  }

  return json.result?.[0]?.results || [];
}

export { schema };
