"use client";

import { useCallback, useMemo, useState } from "react";
import Papa from "papaparse";

// normalize headers: strip BOM, trim, lowercase, turn spaces into underscores
const normalizeHeader = (h: string) =>
  h.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/\s+/g, "_");

type RawRow = {
  asin?: string;
  name?: string;
  affiliate_url?: string;
  category?: string;
};

type Row = {
  asin: string;
  name: string;
  affiliate_url: string;
  category?: string;
};

// parse CSV text (pasted)
function parseCsvText(text: string): { rows: RawRow[]; fields: string[] } {
  const res = Papa.parse<RawRow>(text.replace(/^\uFEFF/, ""), {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  });
  const fields = (res.meta.fields || []).map(normalizeHeader);
  return { rows: (res.data || []) as RawRow[], fields };
}

// parse CSV file (upload/drag-drop)
async function parseCsvFile(file: File): Promise<{ rows: RawRow[]; fields: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (res) => {
        const fields = (res.meta.fields || []).map(normalizeHeader);
        resolve({ rows: (res.data || []) as RawRow[], fields });
      },
      error: reject,
    });
  });
}

// validate presence of required headers
function requireHeaders(fields: string[]) {
  const needed = ["asin", "name", "affiliate_url"];
  const missing = needed.filter((f) => !fields.includes(f));
  if (missing.length) {
    throw new Error(`Missing header(s): ${missing.join(", ")}`);
  }
}

function cleanRow(r: RawRow): Row | null {
  const asin = String(r.asin ?? "").trim();
  const name = String(r.name ?? "").trim();
  const affiliate_url = String(r.affiliate_url ?? "").trim();
  const category = r.category ? String(r.category).trim() : undefined;

  if (!asin || !name || !affiliate_url) return null;
  return { asin, name, affiliate_url, category };
}

export default function ImportProductsPage() {
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleParseText = useCallback((text: string) => {
    setErrors([]);
    try {
      const { rows: rawRows, fields } = parseCsvText(text);
      requireHeaders(fields);
      
      const parsed: Row[] = [];
      for (const r of rawRows) {
        const cleaned = cleanRow(r);
        if (cleaned) parsed.push(cleaned);
      }
      if (!parsed.length) {
        setErrors(["No valid rows found."]);
      } else {
        setRows(parsed);
        setErrors([]);
      }
    } catch (e: any) {
      setErrors([e.message || "Parse error"]);
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setErrors([]);
    try {
      const { rows: rawRows, fields } = await parseCsvFile(file);
      requireHeaders(fields);
      
      const parsed: Row[] = [];
      for (const r of rawRows) {
        const cleaned = cleanRow(r);
        if (cleaned) parsed.push(cleaned);
      }
      if (!parsed.length) {
        setErrors(["No valid rows found."]);
      } else {
        setRows(parsed);
        setErrors([]);
      }
    } catch (e: any) {
      setErrors([e.message || "Parse error"]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const asins = useMemo(() => rows.map((r) => r.asin), [rows]);

  async function previewWithImages() {
    // Calls your Netlify function to resolve images from ASINs
    // Requires NEXT_PUBLIC_SITE_KEY to be set
    setLoading(true);
    setErrors([]);
    try {
      const res = await fetch("/.netlify/functions/amazon-items", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-site-key": process.env.NEXT_PUBLIC_SITE_KEY ?? "",
        },
        body: JSON.stringify({ asins }),
      });
      if (!res.ok) throw new Error(`amazon-items ${res.status}`);
      const { items } = await res.json();
      // Attach image_url to local rows for preview/save
      const imgByAsin: Record<string, string | undefined> = {};
      for (const it of items ?? []) imgByAsin[it.asin] = it.image_url;
      setRows((prev) =>
        prev.map((r) => ({ ...r, image_url: imgByAsin[r.asin] }))
      );
    } catch (e: any) {
      setErrors([e.message || "Failed to fetch preview."]);
    } finally {
      setLoading(false);
    }
  }

  async function saveToCatalog() {
    // POST rows to your existing admin API or storage
    // Replace the URL below with your existing endpoint if needed.
    setLoading(true);
    setErrors([]);
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) throw new Error(`import ${res.status}`);
      alert("Imported");
    } catch (e: any) {
      setErrors([e.message || "Import failed."]);
    } finally {
      setLoading(false);
    }
  }

  function downloadCsvWithImageUrl() {
    const csv = Papa.unparse(
      rows.map((r: any) => ({
        asin: r.asin,
        name: r.name,
        affiliate_url: r.affiliate_url,
        category: r.category ?? "",
        image_url: r.image_url ?? "",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-with-images.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 980, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Import products
      </h1>
      <p style={{ color: "#5b6b7a", marginBottom: 16 }}>
        Required columns: asin, name, affiliate_url. Optional: category.
      </p>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #9aa7b1",
          borderRadius: 12,
          padding: 24,
          marginBottom: 12,
        }}
      >
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileInput}
          style={{ marginBottom: 12 }}
        />
        <div style={{ color: "#344055" }}>
          Drag and drop a CSV file here, or use the file picker.
        </div>
      </div>

      <textarea
        placeholder="Or paste CSV text here…"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        onBlur={() => csvText && handleParseText(csvText)}
        spellCheck={false}
        style={{
          width: "100%",
          height: 200,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          borderRadius: 12,
          border: "1px solid #c8d0d6",
          padding: 12,
          marginBottom: 12,
        }}
      />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => handleParseText(csvText)}>Parse pasted CSV</button>
        <button onClick={previewWithImages} disabled={!rows.length || loading}>
          Preview with images
        </button>
        <button onClick={saveToCatalog} disabled={!rows.length || loading}>
          Save to catalog
        </button>
        <button
          onClick={downloadCsvWithImageUrl}
          disabled={!rows.length}
          title="Creates a CSV including image_url"
        >
          Download CSV with image_url
        </button>
        <button
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(rows, null, 2))
          }
          disabled={!rows.length}
        >
          Copy JSON
        </button>
      </div>

      <div style={{ marginTop: 16, color: "#344055" }}>
        {loading ? "Loading…" : null}
        {!!errors.length && (
          <div style={{ color: "#b00020", marginTop: 8 }}>
            {errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        )}
        {!!rows.length && !errors.length && (
          <div style={{ marginTop: 8 }}>
            Parsed rows: {rows.length}. Unique ASINs:{" "}
            {new Set(rows.map((r) => r.asin)).size}
          </div>
        )}
      </div>
    </div>
  );
}
