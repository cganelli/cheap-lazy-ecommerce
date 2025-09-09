// Edge guard for /.netlify/functions/amazon-items
export default async (req: Request, ctx: any) => {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const ua = req.headers.get("user-agent") || "";
  const method = req.method;

  // allow same-site only
  const sameSite =
    origin.startsWith("https://www.cheapandlazystuff.com") ||
    referer.startsWith("https://www.cheapandlazystuff.com") ||
    origin.startsWith("https://cheapandlazystuff.com") ||
    referer.startsWith("https://cheapandlazystuff.com");

  // require POST and a simple header key
  // TODO: Fix environment variable access in edge functions
  const hasKey = req.headers.get("x-site-key") === "your-site-key-here";

  // drop obvious bots
  const isBot = /\b(bot|crawler|spider|scan|monitor|curl|wget)\b/i.test(ua);

  const cors = {
    "access-control-allow-origin": "https://www.cheapandlazystuff.com",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "x-site-key, content-type",
    "vary": "Origin",
  };

  if (method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  if (!sameSite || method !== "POST" || !hasKey || isBot) {
    return new Response("Forbidden", { status: 403, headers: cors });
  }

  return ctx.next();
};

export const config = {
  path: "/.netlify/functions/amazon-items",
};
