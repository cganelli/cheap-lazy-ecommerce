// netlify/functions/amazon-items.ts
import type { Handler } from '@netlify/functions'
import { readCache } from './_lib/cache'

// at top-level
const ALLOW_ORIGIN = "https://cheapandlazystuff.com";
const baseHeaders = {
  "access-control-allow-origin": ALLOW_ORIGIN,
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, x-site-key",
  "content-type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: baseHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ error: "POST only" }),
    };
  }

  // method + header checks (keep aligned with your edge guard)
  const siteKey = event.headers['x-site-key']
  if (!siteKey || siteKey !== process.env.SITE_KEY) {
    return {
      statusCode: 401,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Unauthorized' })
    }
  }

  // CORS
  const origin = event.headers.origin || ''
  if (origin && origin !== ALLOW_ORIGIN) {
    return {
      statusCode: 403,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Bad origin' })
    }
  }

  const cached = await readCache()
  if (!cached) {
    return {
      statusCode: 503,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Cache empty' })
    }
  }

  // support optional filtering by ASIN list from client
  let filterAsins: string[] = []
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    filterAsins = Array.isArray(body?.asins) ? body.asins : []
  } catch {}

  const items = filterAsins.length
    ? cached.items.filter(i => filterAsins.includes(String(i.asin)))
    : cached.items

  return {
    statusCode: 200,
    headers: baseHeaders,
    body: JSON.stringify({
      updatedAt: cached.updatedAt,
      ttlSeconds: cached.ttlSeconds,
      count: items.length,
      items,
    }),
  }
}
