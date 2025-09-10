// netlify/edge-functions/guard-amazon-items.ts
declare const Deno:
  | { env: { get(name: string): string | undefined } }
  | undefined;

export default async function guard(req: Request) {
  // POST only
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Read key from Netlify env at runtime (Edge)
  const SITE_KEY =
    (typeof Deno !== 'undefined' && Deno?.env?.get('SITE_KEY')) || '';

  // Header auth first: if key is valid, let it through regardless of UA
  const provided = req.headers.get('x-site-key') || '';
  if (SITE_KEY && provided === SITE_KEY) {
    return; // allow to proceed to the function
  }

  // Light bot block for unauthenticated requests
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  if (/bot|crawler|spider|curl|wget/.test(ua)) {
    return new Response('Forbidden', { status: 403 });
  }

  // If we reach here, it was unauthenticated but not a bot
  return new Response('Forbidden', { status: 403 });
}

// Attach to the function path
export const config = {
  path: '/.netlify/functions/amazon-items',
};
};