// netlify/functions/amazon-items.ts
import type { Handler } from '@netlify/functions'
import { readCache } from './_lib/cache'

const ORIGIN = 'https://cheapandlazystuff.com'
const REQUIRED_HEADER = 'x-site-key'

export const handler: Handler = async (event) => {
  // method + header checks (keep aligned with your edge guard)
  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'POST required' })
  }
  const siteKey = event.headers[REQUIRED_HEADER]
  if (!siteKey || siteKey !== process.env.SITE_KEY) {
    return response(401, { error: 'Unauthorized' })
  }

  // CORS
  const origin = event.headers.origin || ''
  if (origin && origin !== ORIGIN) {
    return response(403, { error: 'Bad origin' })
  }

  const cached = await readCache()
  if (!cached) {
    return response(503, { error: 'Cache empty' })
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

  return response(200, {
    updatedAt: cached.updatedAt,
    ttlSeconds: cached.ttlSeconds,
    count: items.length,
    items,
  })
}

function response(statusCode: number, body: any) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': ORIGIN,
      'access-control-allow-headers': REQUIRED_HEADER + ', content-type',
      'access-control-allow-methods': 'POST, OPTIONS',
      'cache-control': 'no-store',
    },
  }
}
