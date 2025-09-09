// netlify/functions/_lib/paapi.ts
import aws4 from 'aws4';

type FetchArgs = { asins: string[] }

export async function fetchAmazonItems({ asins }: FetchArgs) {
  const { PAAPI_ACCESS_KEY, PAAPI_SECRET_KEY, PAAPI_PARTNER_TAG, PAAPI_REGION, PAAPI_HOST } = process.env;
  
  if (!PAAPI_ACCESS_KEY || !PAAPI_SECRET_KEY || !PAAPI_PARTNER_TAG) {
    throw new Error('Missing PA-API environment variables');
  }

  const host = PAAPI_HOST || 'webservices.amazon.com';
  const region = PAAPI_REGION || 'us-east-1';
  const path = '/paapi5/getitems';
  const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';

  const bodyObj = {
    PartnerTag: PAAPI_PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',
    ItemIds: asins.slice(0, 10), // PA-API caps batch size
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'ItemInfo.ByLineInfo',
      'Offers.Listings.Price',
      'Offers.Listings.Availability.Message',
      'Offers.Summaries.LowestPrice'
    ],
  };

  const req = {
    host,
    path,
    service: 'ProductAdvertisingAPI',
    region,
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-amz-target': target,
    },
    body: JSON.stringify(bodyObj),
  };

  aws4.sign(req, { accessKeyId: PAAPI_ACCESS_KEY, secretAccessKey: PAAPI_SECRET_KEY });

  const resp = await fetch(`https://${host}${path}`, {
    method: 'POST',
    headers: req.headers,
    body: req.body,
  });

  const data = await resp.json();

  if (data.Errors && data.Errors.length > 0) {
    console.warn('PA-API Errors:', data.Errors);
  }

  const items = (data.ItemsResult?.Items || []).map(mapItem);
  return items;
}

function mapItem(item: any) {
  const asin = item.ASIN;
  const title = item.ItemInfo?.Title?.DisplayValue || '';
  const imageUrl =
    item.Images?.Primary?.Large?.URL ||
    item.Images?.Primary?.Medium?.URL ||
    item.Images?.Primary?.Small?.URL ||
    '';
  const affiliateUrl = item.DetailPageURL || '';
  const brand = item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || undefined;

  // Price is highly variable in PA-API; prefer DisplayAmount when present
  const listing = item.Offers?.Listings?.[0];
  const priceDisplay = listing?.Price?.DisplayAmount || undefined;
  const currency = listing?.Price?.Currency || undefined;

  // inStock heuristic: if there is at least one listing, assume InStock
  const inStock = !!listing;

  // Ratings often aren't available in PA-API; omit unless present and visible in UI
  const ratingValue = undefined;
  const reviewCount = undefined;

  // These flags control what we actually output to UI + JSON-LD
  const showPrice = !!(priceDisplay && currency);
  const showRating = false;

  return {
    asin,
    title,
    imageUrl,
    affiliateUrl,
    brand,
    price: priceDisplay,
    currency,
    inStock,
    ratingValue,
    reviewCount,
    showPrice,
    showRating,
  };
}
