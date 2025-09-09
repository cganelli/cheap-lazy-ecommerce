import { NextRequest, NextResponse } from 'next/server'

// Replace with your real DB write.
async function saveProducts(items: any[]) {
  // Example: insert into Prisma or Supabase here.
  // await db.product.createMany({ data: items })
  // Placeholder no-op so you see the shape:
  return { saved: items.length }
}

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json()
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'products[] required' }, { status: 400 })
    }
    // Basic validation
    for (const p of products) {
      if (!p.asin || !p.title || !p.affiliateUrl) {
        return NextResponse.json({ error: 'asin, title, affiliateUrl required' }, { status: 400 })
      }
    }
    const res = await saveProducts(products)
    return NextResponse.json({ saved: res.saved })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 })
  }
}
