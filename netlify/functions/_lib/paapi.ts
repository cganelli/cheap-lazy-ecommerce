/* eslint-disable @typescript-eslint/no-explicit-any */
// netlify/functions/_lib/paapi.ts
import aws4 from 'aws4'

type FetchArgs = { asins: string[] }

const ACCESS_KEY = process.env.PAAPI_ACCESS_KEY || ''
const SECRET_KEY = process.env.PAAPI_SECRET_KEY || ''
const PARTNER_TAG = process.env.PAAPI_PARTNER_TAG || ''
const REGION = process.env.PAAPI_REGION || 'us-east-1'
const HOST = process.env.PAAPI_HOST || 'webservices.amazon.com'
const PATH = '/paapi5/getitems'

export async function fetchAmazonItems({ asins }: FetchArgs) {
  if (!ACCESS_KEY || !SECRET_KEY || !PARTNER_TAG) {
    throw new Error('Missing PA-API env vars')
  }

  const uniq = [...new Set(asins)].filter(Boolean)
  if (uniq.length === 0) return []

  const chunks = chunk(uniq, 10) // PA-API limit: 10 ASINs per call
  const out: Record<string, any>[] = []

  for (const c of chunks) {
    const batch = await getItemsBatch(c)
    out.push(...batch)
  }

  return out
}

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

async function getItemsBatch(asins: string[]) {
  const body = JSON.stringify({
    ItemIds: asins,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.Availability.Message',
      'Offers.Listings.IsBuyBoxWinner',
    ],
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',
  })

  const req = {
    host: HOST,
    path: PATH,
    method: 'POST',
    service: 'ProductAdvertisingAPI',
    region: REGION,
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body,
  }

  aws4.sign(req as any, {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  })

  const url = `https://${HOST}${PATH}`
  const res = await fetch(url, {
    method: 'POST',
    headers: req.headers as any,
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PA-API ${res.status}: ${text}`)
  }

  const data = await res.json()

  const items = (data?.ItemsResult?.Items || []).map(normalizeItem)
  const errors = data?.Errors || []
  const unprocessed = data?.ItemsResult?.Errors || []

  if ((errors.length || unprocessed?.length) && process.env.NODE_ENV !== 'production') {
    console.warn('PA-API warnings', { errors, unprocessed })
  }

  return items
}

function normalizeItem(i: any) {
  const listing = i?.Offers?.Listings?.[0] || {}
  const priceObj = listing?.Price || {}
  const image =
    i?.Images?.Primary?.Large?.URL ||
    i?.Images?.Primary?.Medium?.URL ||
    null

  return {
    asin: i?.ASIN || '',
    title: i?.ItemInfo?.Title?.DisplayValue || '',
    url: i?.DetailPageURL || '',
    price: typeof priceObj?.Amount === 'number' ? priceObj.Amount : null,
    currency: priceObj?.Currency || null,
    availability: listing?.Availability?.Message || null,
    isBuyBox: listing?.IsBuyBoxWinner ?? null,
    image,
    raw: undefined, // keep payload lean; set to i if you want full raw data
  }
}
