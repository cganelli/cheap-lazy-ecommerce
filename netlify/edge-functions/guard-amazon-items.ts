// netlify/edge-functions/guard-amazon-items.ts
// TS shim so Next.js doesn't error when compiling (Deno types only exist at runtime)
declare const Deno:
  | { env: { get(name: string): string | undefined } }
  | undefined;

export default async function guard(req: Request) {
  // Read key from Netlify env at runtime
  const SITE_KEY =
    (typeof Deno !== 'undefined' && Deno?.env?.get('SITE_KEY')) || '';

  // POST only
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Light bot block
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  if (/bot|crawler|spider|curl|wget/.test(ua)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Header auth
  const provided = req.headers.get('x-site-key') || '';
  if (!SITE_KEY || provided !== SITE_KEY) {
    return new Response('Forbidden', { status: 403 });
  }

  // allow request to continue to the serverless function
  return;
}

// Attach to the Amazon function path
export const config = {
  path: '/.netlify/functions/amazon-items',
};