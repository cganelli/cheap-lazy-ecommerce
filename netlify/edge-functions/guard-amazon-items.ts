// netlify/edge-functions/guard-amazon-items.ts
export default async (req: Request, _ctx: any) => {
  const url = new URL(req.url);

  // === CORS / Preflight ===
  const ALLOW_ORIGIN = "https://cheapandlazystuff.com"; // adjust if using a preview domain
  const corsHeaders = {
    "access-control-allow-origin": ALLOW_ORIGIN,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-site-key",
    "vary": "origin",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // === Same-site check ===
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const sameSite =
    origin.startsWith(ALLOW_ORIGIN) ||
    referer.startsWith(ALLOW_ORIGIN) ||
    origin === "" || // allow server-to-server / same-origin without origin header
    referer === "";

  if (!sameSite) {
    return new Response("Forbidden (origin)", { status: 403, headers: corsHeaders });
  }

  // === Method check ===
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // === Header key check ===
  const hasKey = req.headers.get("x-site-key") === "YOUR_ACTUAL_SITE_KEY"; // keep in sync with Netlify env
  if (!hasKey) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  // Allow through to the function
  return await _ctx.next();
};

export const config = { path: "/.netlify/functions/amazon-items" };
