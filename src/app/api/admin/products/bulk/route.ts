/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { validateSiteKey, unauthorizedResponse } from '@/lib/auth'
import { logSecurityEvent } from '@/lib/logSecurityEvent'
import { checkRateLimit, deriveIdentifier } from '@/lib/rateLimiter'

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
    const hasHeader = req.headers.get('x-site-key') !== null;
    logSecurityEvent(
      'admin/bulk',
      'auth_failed',
      hasHeader ? 'invalid x-site-key' : 'missing x-site-key'
    );
    return unauthorizedResponse();
  }

  // Rate limiting check
  const identifier = deriveIdentifier(req.headers, 'admin/bulk');
  const { allowed, retryAfterMs } = checkRateLimit({
    route: 'admin/bulk',
    identifier,
  });

  if (!allowed) {
    logSecurityEvent(
      'admin/bulk',
      'rate_limited',
      'too many requests in window',
      { identifier }
    );

    const headers: HeadersInit = { 'content-type': 'application/json' };
    if (retryAfterMs !== undefined) {
      headers['Retry-After'] = Math.ceil(retryAfterMs / 1000).toString();
    }

    return NextResponse.json(
      { error: 'Too many requests. Try again soon.' },
      { status: 429, headers }
    );
  }

  try {
    const { products } = await req.json()
    
    if (!Array.isArray(products) || products.length === 0) {
      logSecurityEvent('admin/bulk', 'validation_failed', 'products array missing or empty');
      return NextResponse.json({ error: 'products[] required' }, { status: 400 })
    }

    // Limit batch size
    if (products.length > 1000) {
      logSecurityEvent('admin/bulk', 'validation_failed', 'batch size too large', {
        batchSize: products.length,
        maxAllowed: 1000
      });
      return NextResponse.json({ error: 'Too many products. Maximum 1000 per request.' }, { status: 400 })
    }

    // Validate and sanitize
    const validProducts: any[] = [];
    let firstInvalidAsin: string | undefined;
    let validationError: string | undefined;
    
    for (const p of products) {
      if (validateProduct(p)) {
        validProducts.push(sanitizeProduct(p));
      } else {
        // Capture first invalid product for logging (in dev only)
        if (!firstInvalidAsin && p?.asin) {
          firstInvalidAsin = String(p.asin).trim();
          
          // Determine specific validation failure
          if (!p.asin || typeof p.asin !== 'string' || !/^[A-Z0-9]{10}$/i.test(p.asin.trim())) {
            validationError = 'ASIN format invalid';
          } else if (!p.affiliateUrl || typeof p.affiliateUrl !== 'string') {
            validationError = 'affiliateUrl missing or invalid';
          } else {
            try {
              const url = new URL(p.affiliateUrl.trim());
              if (!['http:', 'https:'].includes(url.protocol)) {
                validationError = 'URL protocol invalid';
              }
            } catch {
              validationError = 'URL validation failed';
            }
          }
        }
      }
    }

    if (validProducts.length === 0) {
      logSecurityEvent(
        'admin/bulk',
        'validation_failed',
        validationError || 'no valid products found',
        firstInvalidAsin ? { asinSample: firstInvalidAsin } : undefined
      );
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
    }

    const res = await saveProducts(validProducts)
    return NextResponse.json({ saved: res.saved })
  } catch (e: any) {
    // Log unexpected internal errors
    logSecurityEvent(
      'admin/bulk',
      'internal_error',
      'unexpected error during bulk operation',
      { message: e?.message || 'unknown error' }
    );
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    return NextResponse.json({ 
      error: isDevelopment ? (e.message || 'failed') : 'Internal server error' 
    }, { status: 500 })
  }
}

