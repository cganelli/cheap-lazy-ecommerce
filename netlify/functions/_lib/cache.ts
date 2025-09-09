// netlify/functions/_lib/cache.ts
import { getStore } from '@netlify/blobs'

const STORE_NAME = 'amazon-cache'
const KEY = 'prices-v1'

export type CachedItems = {
  updatedAt: number
  ttlSeconds: number
  items: Record<string, any>[]  // normalized PA-API items
}

const store = getStore({ name: STORE_NAME })

export async function readCache(): Promise<CachedItems | null> {
  return await store.getJSON(KEY)
}

export async function writeCache(payload: CachedItems) {
  await store.setJSON(KEY, payload)
}
