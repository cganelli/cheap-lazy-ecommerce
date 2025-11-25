/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { validateSiteKey, unauthorizedResponse } from "@/lib/auth";

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
    return unauthorizedResponse();
  }

  try {
    const body = await req.json();
    const { rows } = body;
    
    // Validate input structure
    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(JSON.stringify({ error: "No rows provided" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Limit batch size to prevent DoS
    if (rows.length > 1000) {
      return new Response(JSON.stringify({ error: "Too many rows. Maximum 1000 rows per request." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Validate and sanitize each row
    const validRows: Row[] = [];
    for (const row of rows) {
      if (validateRow(row)) {
        validRows.push(sanitizeRow(row));
      }
    }

    if (validRows.length === 0) {
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
