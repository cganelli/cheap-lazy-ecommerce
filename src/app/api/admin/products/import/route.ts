import type { NextRequest } from "next/server";

type Row = {
  asin: string;
  name: string;
  affiliate_url: string;
  category?: string;
  image_url?: string;
};

// TODO: replace with your DB write.
async function persist(rows: Row[]) {
  console.log("Importing rows:", rows.length);
  return { ok: true, imported: rows.length };
}

export async function POST(req: NextRequest) {
  try {
    const { rows } = await req.json();
    if (!Array.isArray(rows) || !rows.length) {
      return new Response(JSON.stringify({ error: "No rows" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const result = await persist(rows);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
