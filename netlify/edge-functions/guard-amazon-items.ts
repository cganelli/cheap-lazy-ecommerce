// netlify/edge-functions/guard-amazon-items.ts

// Make TS happy during Next.js build and read the key at the edge.
declare const Deno:
  | { env: { get(name: string): string | undefined } }
  | undefined;

const SITE_KEY =
  (typeof Deno !== "undefined" && Deno?.env?.get("SITE_KEY")) || "";

export default async function guard(req: Request, context: any) {
  // Handle CORS preflight quickly
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": req.headers.get("origin") ?? "*",
        "access-control-allow-headers": "content-type,x-site-key",
        "access-control-allow-methods": "POST,OPTIONS",
      },
    });
  }

  if (!SITE_KEY) {
    return new Response("SITE_KEY not set", { status: 500 });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const headerKey = req.headers.get("x-site-key");
  if (!headerKey || headerKey !== SITE_KEY) {
    return new Response("Forbidden", { status: 403 });
  }

  // All good — continue to the serverless function
  return context.next();
}