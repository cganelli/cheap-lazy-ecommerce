/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { validateSiteKey, unauthorizedResponse } from '@/lib/auth'

// Replace with your real DB write.
async function saveProducts(items: any[]) {
  // Example: insert into Prisma or Supabase here.
  // await db.product.createMany({ data: items })
  // Placeholder no-op so you see the shape:
  return { saved: items.length }
}

function validateProduct(p: any): boolean {
  if (!p || typeof p !== 'object') return false;
  
  // Validate required fields
  if (!p.asin || typeof p.asin !== 'string' || !/^[A-Z0-9]{10}$/i.test(p.asin.trim())) return false;
  if (!p.title || typeof p.title !== 'string' || p.title.trim().length === 0) return false;
  if (!p.affiliateUrl || typeof p.affiliateUrl !== 'string') return false;
  
  // Validate URL
  try {
    const url = new URL(p.affiliateUrl.trim());
    if (!['http:', 'https:'].includes(url.protocol)) return false;
  } catch {
    return false;
  }
  
  // Validate field lengths
  if (p.title.length > 500) return false;
  if (p.affiliateUrl.length > 2048) return false;
  
  return true;
}

function sanitizeProduct(p: any) {
  return {
    asin: String(p.asin).trim().toUpperCase(),
    title: String(p.title).trim().substring(0, 500),
    affiliateUrl: String(p.affiliateUrl).trim(),
  };
}

export async function POST(req: NextRequest) {
  // Authentication check
  if (!validateSiteKey(req)) {
    return unauthorizedResponse();
  }

  try {
    const { products } = await req.json()
    
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'products[] required' }, { status: 400 })
    }

    // Limit batch size
    if (products.length > 1000) {
      return NextResponse.json({ error: 'Too many products. Maximum 1000 per request.' }, { status: 400 })
    }

    // Validate and sanitize
    const validProducts: any[] = [];
    for (const p of products) {
      if (validateProduct(p)) {
        validProducts.push(sanitizeProduct(p));
      }
    }

    if (validProducts.length === 0) {
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
    }

    const res = await saveProducts(validProducts)
    return NextResponse.json({ saved: res.saved })
  } catch (e: any) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return NextResponse.json({ 
      error: isDevelopment ? (e.message || 'failed') : 'Internal server error' 
    }, { status: 500 })
  }
}

