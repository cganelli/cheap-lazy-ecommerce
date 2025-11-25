/**
 * Authentication utilities for API routes
 * 
 * Location: src/lib/auth.ts
 * Purpose: Provide authentication helpers for protecting API endpoints
 */

/**
 * Validates the SITE_KEY from request headers
 * This should match the SITE_KEY environment variable (server-side only)
 */
export function validateSiteKey(request: Request): boolean {
  const siteKey = process.env.SITE_KEY || '';
  if (!siteKey) {
    return false; // No key configured means auth is disabled (not recommended for production)
  }

  const providedKey =
    request.headers.get('x-site-key') ||
    request.headers.get('X-Site-Key') ||
    request.headers.get('x-Site-Key') ||
    '';

  return providedKey === siteKey;
}

/**
 * Creates an error response for unauthorized requests
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

