// Netlify Function: /.netlify/functions/amazon-items
// Securely calls Amazon PA-API (GetItems) and returns normalized fields for the UI + JSON-LD.

const aws4 = require('aws4');

exports.handler = async (event) => {
  try {
    const { PAAPI_ACCESS_KEY, PAAPI_SECRET_KEY, PAAPI_PARTNER_TAG } = process.env;
    if (!PAAPI_ACCESS_KEY || !PAAPI_SECRET_KEY || !PAAPI_PARTNER_TAG) {
      return json(500, { error: 'Missing PA-API env vars' });
    }

    const asinsParam = event.queryStringParameters?.asins || '';
    const asins = asinsParam.split(',').map(s => s.trim()).filter(Boolean);
    if (!asins.length) return json(400, { error: 'Provide ?asins=ASIN1,ASIN2' });

    const host   = 'webservices.amazon.com';
    const region = 'us-east-1';
    const path   = '/paapi5/getitems';
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

    const items = (data.ItemsResult?.Items || []).map(mapItem);

    // Include any API Errors array for visibility
    return json(200, { items, errors: data.Errors || null });
  } catch (err) {
    return json(500, { error: String(err?.message || err) });
  }
};

function mapItem(item) {
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

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,OPTIONS',
    },
    body: JSON.stringify(obj),
  };
}
