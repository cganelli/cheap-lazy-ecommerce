/**
 * Security event logging utility
 * 
 * Location: src/lib/logSecurityEvent.ts
 * Purpose: Centralized security-focused logging for admin API routes
 * 
 * Rules:
 * - Use console.warn for expected "bad" behavior (auth failures, validation failures)
 * - Use console.error for unexpected internal errors
 * - Never log secrets, full headers, keys, or env vars
 * - May log truncated ASIN or URL host, but not full URLs with query params
 */

type SecurityEvent = 'auth_failed' | 'validation_failed' | 'internal_error' | 'rate_limited';

type LogDetails = Record<string, unknown>;

/**
 * Logs security events with appropriate verbosity based on environment
 * 
 * @param route - The API route name (e.g., 'admin/import', 'admin/bulk')
 * @param event - Type of security event
 * @param reason - Generic reason for the event
 * @param details - Optional additional details (only logged in non-production)
 */
export function logSecurityEvent(
  route: string,
  event: SecurityEvent,
  reason: string,
  details?: LogDetails
): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Sanitize details to remove sensitive information
  const sanitizedDetails = details ? sanitizeDetails(details) : undefined;
  
  const logData: {
    route: string;
    event: SecurityEvent;
    reason: string;
    details?: LogDetails;
  } = {
    route,
    event,
    reason,
  };
  
  // Only include details in non-production
  if (!isProduction && sanitizedDetails) {
    logData.details = sanitizedDetails;
  }
  
  // Use console.warn for expected bad behavior, console.error for unexpected errors
  if (event === 'internal_error') {
    console.error('[SECURITY]', JSON.stringify(logData));
  } else {
    console.warn('[SECURITY]', JSON.stringify(logData));
  }
}

/**
 * Sanitizes log details to remove sensitive information
 * - Truncates ASINs to first 4 characters
 * - Extracts only hostname from URLs (no query params, no path)
 * - Removes any keys that might contain secrets
 */
function sanitizeDetails(details: LogDetails): LogDetails {
  const sanitized: LogDetails = {};
  const sensitiveKeys = ['key', 'secret', 'token', 'password', 'header', 'headers', 'env'];
  
  for (const [key, value] of Object.entries(details)) {
    // Skip sensitive keys
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      continue;
    }
    
    // Handle ASINs - truncate to first 4 chars
    if (key.toLowerCase().includes('asin') && typeof value === 'string') {
      sanitized[key] = value.substring(0, 4) + '...';
      continue;
    }
    
    // Handle URLs - extract only hostname
    if (key.toLowerCase().includes('url') && typeof value === 'string') {
      try {
        const url = new URL(value);
        sanitized[key] = url.hostname;
      } catch {
        // If URL parsing fails, just truncate the string
        sanitized[key] = value.substring(0, 50) + '...';
      }
      continue;
    }
    
    // For other values, include as-is if they're safe types
    if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = value.substring(0, 100) + '...';
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

