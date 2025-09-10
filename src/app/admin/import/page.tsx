// app/admin/import/page.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Papa from "papaparse";

type Row = {
  asin: string;
  name: string;
  affiliate_url: string;
  category?: string;
};

const REQUIRED = ["asin", "name", "affiliate_url"] as const;

const normalizeHeader = (h: string) =>
  h
    .replace(/^\uFEFF/, "") // strip BOM
    .toLowerCase()
    .replace(/[''"'']/g, "'")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const headerSynonyms: Record<string, "asin" | "name" | "affiliate_url" | "category"> = {
  asin: "asin",
  "amazon_asin": "asin",
  "sku_asin": "asin",

  name: "name",
  title: "name",
  product_name: "name",

  affiliate_url: "affiliate_url",
  affiliate_link: "affiliate_url",
  url: "affiliate_url",
  link: "affiliate_url",

  category: "category",
  categories: "category",
};

function mapHeaders(fields: string[]) {
  const map: Record<string, string> = {};
  for (const raw of fields) {
    const norm = normalizeHeader(raw);
    const canonical = headerSynonyms[norm];
    if (canonical) map[raw] = canonical;
  }
  return map;
}

function coerceRows<T extends Record<string, any>>(rows: T[], headerMap: Record<string, string>): Row[] {
  return rows
    .map((r) => {
      const o: any = {};
      for (const [raw, canon] of Object.entries(headerMap)) {
        if (r[raw] != null) o[canon] = String(r[raw]).trim();
      }
      return o as Row;
    })
    .filter((r) => r.asin && r.name && r.affiliate_url);
}

export default function ImportProductsPage() {
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const requiredMissing = useMemo(() => {
    const present = new Set(Object.keys(rows[0] || {}));
    return REQUIRED.filter((k) => !present.has(k));
  }, [rows]);

  const parseText = useCallback(async () => {
    setStatus("Parsing...");
    setErrors([]);

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (res) => {
        const fields = (res.meta.fields || []).map((f) => f as string);
        const headerMap = mapHeaders(fields);

        const parsed = coerceRows(res.data as any[], headerMap);
        setRows(parsed);
        setStatus(`Parsed rows: ${parsed.length}. Unique ASINs: ${new Set(parsed.map((r) => r.asin)).size}`);
      },
      error: (e: Error) => {
        setErrors([e.message]);
        setStatus("");
      },
    });
  }, [csvText]);

  const parseFile = useCallback(() => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setStatus("Parsing file...");
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (res) => {
        const fields = (res.meta.fields || []).map((f) => f as string);
        const headerMap = mapHeaders(fields);

        const parsed = coerceRows(res.data as any[], headerMap);
        setRows(parsed);
        setCsvText(Papa.unparse(parsed)); // also fill the textarea with normalized CSV
        setStatus(`Parsed rows: ${parsed.length}. Unique ASINs: ${new Set(parsed.map((r) => r.asin)).size}`);
      },
      error: (e: Error) => {
        setErrors([e.message]);
        setStatus("");
      },
    });
  }, []);

  const previewWithImages = useCallback(async () => {
    try {
      setStatus("Loading...");
      setErrors([]);

      const asins = Array.from(new Set(rows.map((r) => r.asin.trim()))).slice(0, 100);

      if (!asins.length) {
        setErrors(["No ASINs parsed yet. Parse a CSV first."]);
        setStatus("");
        return;
      }

      const siteKey = process.env.NEXT_PUBLIC_SITE_KEY || "";
      if (!siteKey) {
        setErrors(["NEXT_PUBLIC_SITE_KEY is not set in .env.local"]);
        setStatus("");
        return;
      }

      const resp = await fetch("/.netlify/functions/amazon-items", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-site-key": siteKey,
        },
        body: JSON.stringify({ asins }),
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Fetch failed ${resp.status}: ${txt || resp.statusText}`);
      }

      const data = await resp.json();
      console.log("Preview data", data);
      setStatus(`Received ${Object.keys(data?.items || {}).length} images from cache.`);
    } catch (e: any) {
      setErrors([e.message || String(e)]);
      setStatus("");
    }
  }, [rows]);

  const downloadCsvWithImageUrl = useCallback(() => {
    if (!rows.length) return;
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [rows]);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Import products</h1>
      <p>Required columns: <code>asin</code>, <code>name</code>, <code>affiliate_url</code>. Optional: <code>category</code>.</p>

      <div style={{ border: "1px dashed #999", padding: 16, borderRadius: 8, marginBottom: 12 }}>
        <input ref={fileRef} type="file" accept=".csv,text/csv" />
        <div style={{ marginTop: 8 }}>
          <button onClick={parseFile}>Parse uploaded CSV</button>
        </div>
      </div>

      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        placeholder="Or paste CSV text here…"
        style={{ width: "100%", minHeight: 240, padding: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      />

      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={parseText}>Parse pasted CSV</button>
        <button onClick={previewWithImages}>Preview with images</button>
        <button onClick={downloadCsvWithImageUrl}>Download CSV with image_url</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {status && <p><strong>{status}</strong></p>}
        {!!requiredMissing.length && rows.length === 0 && (
          <p style={{ color: "#b00020" }}>Missing header(s): {requiredMissing.join(", ")}</p>
        )}
        {!!errors.length && (
          <ul style={{ color: "#b00020" }}>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
