/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { validateSiteKey, unauthorizedResponse } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/logSecurityEvent";
import { checkRateLimit, deriveIdentifier } from "@/lib/rateLimiter";

type Row = {
  asin: string;
  name: string;
  affiliate_url: string;
  category?: string;
  image_url?: string;
};

// Input validation and sanitization
function validateRow(row: any): row is Row {
  if (!row || typeof row !== 'object') return false;
  
  // Validate required fields
  if (!row.asin || typeof row.asin !== 'string' || row.asin.trim().length === 0) return false;
  if (!row.name || typeof row.name !== 'string' || row.name.trim().length === 0) return false;
  if (!row.affiliate_url || typeof row.affiliate_url !== 'string' || row.affiliate_url.trim().length === 0) return false;
  
  // Validate ASIN format (10 alphanumeric characters)
  if (!/^[A-Z0-9]{10}$/i.test(row.asin.trim())) return false;
  
  // Validate URL format
  try {
    const url = new URL(row.affiliate_url.trim());
    if (!['http:', 'https:'].includes(url.protocol)) return false;
  } catch {
    return false;
  }
  
  // Validate optional fields
  if (row.category && (typeof row.category !== 'string' || row.category.length > 100)) return false;
  if (row.image_url && (typeof row.image_url !== 'string' || row.image_url.length > 2048)) return false;
  
  return true;
}

function sanitizeRow(row: any): Row {
  return {
    asin: String(row.asin).trim().toUpperCase(),
    name: String(row.name).trim().substring(0, 500), // Limit length
    affiliate_url: String(row.affiliate_url).trim(),
    category: row.category ? String(row.category).trim().substring(0, 100) : undefined,
    image_url: row.image_url ? String(row.image_url).trim().substring(0, 2048) : undefined,
  };
}

// TODO: replace with your DB write.
async function persist(rows: Row[]) {
  console.log("Importing rows:", rows.length);
  return { ok: true, imported: rows.length };
}

export async function POST(req: NextRequest) {
  // Authentication check
  if (!validateSiteKey(req)) {
    const hasHeader = req.headers.get('x-site-key') !== null;
    logSecurityEvent(
      'admin/import',
      'auth_failed',
      hasHeader ? 'invalid x-site-key' : 'missing x-site-key'
    );
    return unauthorizedResponse();
  }

  // Rate limiting check
  const identifier = deriveIdentifier(req.headers, 'admin/import');
  const { allowed, retryAfterMs } = checkRateLimit({
    route: 'admin/import',
    identifier,
  });

  if (!allowed) {
    logSecurityEvent(
      'admin/import',
      'rate_limited',
      'too many requests in window',
      { identifier }
    );

    const headers: HeadersInit = { 'content-type': 'application/json' };
    if (retryAfterMs !== undefined) {
      headers['Retry-After'] = Math.ceil(retryAfterMs / 1000).toString();
    }

    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again soon.' }),
      {
        status: 429,
        headers,
      }
    );
  }

  try {
    const body = await req.json();
    const { rows } = body;
    
    // Validate input structure
    if (!Array.isArray(rows) || rows.length === 0) {
      logSecurityEvent('admin/import', 'validation_failed', 'no rows provided');
      return new Response(JSON.stringify({ error: "No rows provided" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Limit batch size to prevent DoS
    if (rows.length > 1000) {
      logSecurityEvent('admin/import', 'validation_failed', 'batch size too large', {
        batchSize: rows.length,
        maxAllowed: 1000
      });
      return new Response(JSON.stringify({ error: "Too many rows. Maximum 1000 rows per request." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Validate and sanitize each row
    const validRows: Row[] = [];
    let firstInvalidAsin: string | undefined;
    let validationError: string | undefined;
    
    for (const row of rows) {
      if (validateRow(row)) {
        validRows.push(sanitizeRow(row));
      } else {
        // Capture first invalid row for logging (in dev only)
        if (!firstInvalidAsin && row?.asin) {
          firstInvalidAsin = String(row.asin).trim();
          
          // Determine specific validation failure
          if (!row.asin || typeof row.asin !== 'string' || !/^[A-Z0-9]{10}$/i.test(row.asin.trim())) {
            validationError = 'ASIN format invalid';
          } else if (!row.affiliate_url || typeof row.affiliate_url !== 'string') {
            validationError = 'affiliate_url missing or invalid';
          } else {
            try {
              const url = new URL(row.affiliate_url.trim());
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

    if (validRows.length === 0) {
      logSecurityEvent(
        'admin/import',
        'validation_failed',
        validationError || 'no valid rows found',
        firstInvalidAsin ? { asinSample: firstInvalidAsin } : undefined
      );
      return new Response(JSON.stringify({ error: "No valid rows found" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const result = await persist(validRows);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    // Log unexpected internal errors
    logSecurityEvent(
      'admin/import',
      'internal_error',
      'unexpected error during import',
      { message: e?.message || 'unknown error' }
    );
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    return new Response(JSON.stringify({ 
      error: isDevelopment ? (e?.message || "Internal server error") : "Internal server error" 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
