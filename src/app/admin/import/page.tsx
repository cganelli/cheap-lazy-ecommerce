/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/import/page.tsx
// Admin page for importing products via CSV file upload
// Supports columns: asin, name, affiliate_url, category
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
  const [isDragOver, setIsDragOver] = useState(false);
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
    if (!file) {
      setErrors(["No file selected. Please choose a CSV file first."]);
      return;
    }

    // Security: File size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setErrors([`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`]);
      return;
    }

    // Check if file is CSV-like
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    const isCsvFile = fileName.endsWith('.csv') || 
                     fileType.includes('csv') || 
                     fileType.includes('text/plain') ||
                     fileType === '';

    if (!isCsvFile) {
      setErrors(["Please select a CSV file (.csv extension or CSV content)"]);
      return;
    }

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
        setErrors([`Error parsing file: ${e.message}`]);
        setStatus("");
      },
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.name.toLowerCase().endsWith('.csv') || 
      file.type.toLowerCase().includes('csv') ||
      file.type.toLowerCase().includes('text/plain') ||
      file.type === '' // Some browsers don't set MIME type
    );
    
    if (csvFile) {
      // Security: File size limit (5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (csvFile.size > MAX_FILE_SIZE) {
        setErrors([`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`]);
        return;
      }

      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(csvFile);
      if (fileRef.current) {
        fileRef.current.files = dataTransfer.files;
        parseFile();
      }
    } else {
      setErrors(["Please drop a CSV file (.csv extension). Files found: " + files.map(f => f.name).join(", ")]);
    }
  }, [parseFile]);

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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="hero bg-base-200 rounded-lg mb-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-primary">Import Products</h1>
            <p className="py-4">
              Upload a CSV file with your products. Required columns: <code className="bg-base-300 px-2 py-1 rounded">asin</code>, <code className="bg-base-300 px-2 py-1 rounded">name</code>, <code className="bg-base-300 px-2 py-1 rounded">affiliate_url</code>. Optional: <code className="bg-base-300 px-2 py-1 rounded">category</code>.
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📁 Upload CSV File</h2>
          
          {/* Drag and Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-base-300 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <svg className="w-12 h-12 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-lg font-medium">Drop your CSV file here</p>
                <p className="text-sm text-base-content/70">or click to browse</p>
              </div>
            </div>
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Or choose your CSV file manually</span>
            </label>
            <input 
              ref={fileRef} 
              type="file" 
              accept=".csv" 
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log('File selected:', file.name, file.type);
                }
              }}
            />
            <label className="label">
              <span className="label-text-alt">Supported formats: .csv files only</span>
            </label>
            
            {/* Fallback input without restrictions */}
            <div className="mt-2">
              <label className="label">
                <span className="label-text text-sm text-base-content/70">If CSV files don't show up, try this:</span>
              </label>
              <input 
                type="file" 
                className="file-input file-input-bordered file-input-secondary w-full"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('Fallback file selected:', file.name, file.type);
                    // Copy to main file input
                    if (fileRef.current) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      fileRef.current.files = dataTransfer.files;
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-4">
            <button 
              onClick={parseFile}
              className="btn btn-primary"
              disabled={!fileRef.current?.files?.[0]}
            >
              📊 Parse Uploaded CSV
            </button>
          </div>
        </div>
      </div>

      {/* Alternative: Paste CSV */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📝 Or Paste CSV Text</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Paste your CSV data here</span>
            </label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="asin,name,affiliate_url,category&#10;B123456789,Amazing Product,https://amazon.com/dp/B123456789,Electronics&#10;..."
              className="textarea textarea-bordered h-32 font-mono text-sm"
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button 
              onClick={parseText}
              className="btn btn-secondary"
              disabled={!csvText.trim()}
            >
              📊 Parse Pasted CSV
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      {rows.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">✅ Parsed Data ({rows.length} products)</h2>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={previewWithImages}
                className="btn btn-info"
              >
                🖼️ Preview with Images
              </button>
              <button 
                onClick={downloadCsvWithImageUrl}
                className="btn btn-success"
              >
                💾 Download Enhanced CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div className="space-y-4">
        {status && (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{status}</span>
          </div>
        )}

        {!!requiredMissing.length && rows.length === 0 && (
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Missing required header(s): {requiredMissing.join(", ")}</span>
          </div>
        )}

        {!!errors.length && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Errors:</h3>
              <ul className="list-disc list-inside">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
