/* eslint-disable @typescript-eslint/no-explicit-any */
// netlify/functions/amazon-items.ts
import type { Handler } from '@netlify/functions'
import aws4 from 'aws4'

// CORS helper
const cors = {
  'access-control-allow-origin': 'https://cheapandlazystuff.com',
  'access-control-allow-headers': 'content-type,x-site-key',
  'access-control-allow-methods': 'POST,OPTIONS',
}

const ACCESS_KEY = process.env.PAAPI_ACCESS_KEY || ''
const SECRET_KEY = process.env.PAAPI_SECRET_KEY || ''
const PARTNER_TAG = process.env.PAAPI_PARTNER_TAG || ''
const REGION = process.env.PAAPI_REGION || 'us-east-1'
const HOST = process.env.PAAPI_HOST || 'webservices.amazon.com'
const SITE_KEY = process.env.SITE_KEY || ''

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', ...cors },
    body: JSON.stringify(body),
  }
}

export const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' })
  }

  // Very simple auth: header must match your SITE_KEY env var
  const headerKey =
    event.headers['x-site-key'] ||
    event.headers['X-Site-Key'] ||
    event.headers['x-Site-Key']
  if (!SITE_KEY || headerKey !== SITE_KEY) {
    return json(403, { error: 'Forbidden' })
  }

  // Parse ASINs
  let asins: string[] = []
  try {
    const body = JSON.parse(event.body || '{}')
    asins = Array.from(
      new Set(((body?.asins || []) as string[]).map((s) => String(s).trim()))
    ).filter(Boolean)
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }

  if (asins.length === 0) return json(400, { error: 'No ASINs provided' })

  // PA-API allows 10 ASINs per request; keep it simple and take the first 10.
  asins = asins.slice(0, 10)

  // Build PA-API GetItems request
  const path = '/paapi5/getitems'
  const payload = {
    ItemIds: asins,
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'DetailPageURL',
    ],
  }
  const bodyStr = JSON.stringify(payload)

  const opts: any = {
    host: HOST,
    path,
    region: REGION,
    service: 'ProductAdvertisingAPI',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Amz-Target':
        'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
      'Content-Encoding': 'amz-1.0',
    },
    body: bodyStr,
  }

  if (!ACCESS_KEY || !SECRET_KEY || !PARTNER_TAG) {
    return json(500, {
      error:
        'Missing PA-API env vars. Set PAAPI_ACCESS_KEY, PAAPI_SECRET_KEY, PAAPI_PARTNER_TAG.',
    })
  }

  aws4.sign(opts, { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY })

  const resp = await fetch(`https://${HOST}${path}`, {
    method: 'POST',
    headers: opts.headers as any,
    body: bodyStr,
  })

  const data = await resp.json().catch(() => ({}))

  if (!resp.ok) {
    return json(resp.status, { error: 'PA-API error', details: data })
  }

  const items = (data?.ItemsResult?.Items || []).map((it: any) => ({
    asin: it?.ASIN,
    name: it?.ItemInfo?.Title?.DisplayValue || '',
    url: it?.DetailPageURL || '',
    image_url: it?.Images?.Primary?.Large?.URL || null,
    price: it?.Offers?.Listings?.[0]?.Price?.DisplayAmount || null,
  }))

  return json(200, { items })
}