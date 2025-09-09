// netlify/functions/refresh-amazon-cache.ts
export const config = { schedule: '@hourly' } // hourly refresh

import { writeCache } from './_lib/cache'
import { fetchAmazonItems } from './_lib/paapi'

// source of truth for products to refresh
// replace with your list or load from a file/db
const ASINS: string[] = [
  // Add your ASINs here - example:
  // 'B08N5WRWNW', 'B07FZ8S74R', 'B08N5WRWNW'
  // You can also load this from a file or database
]

export async function handler() {
  if (ASINS.length === 0) {
    return { statusCode: 200, body: 'No ASINs configured' }
  }

  try {
    // fetch fresh data from PA-API
    const items = await fetchAmazonItems({ asins: ASINS })

    // write to cache with a TTL window
    await writeCache({
      updatedAt: Date.now(),
      ttlSeconds: 3600, // 1 hour
      items,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, count: items.length }),
      headers: { 'content-type': 'application/json' },
    }
  } catch (error) {
    console.error('Cache refresh failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Cache refresh failed' }),
      headers: { 'content-type': 'application/json' },
    }
  }
}
