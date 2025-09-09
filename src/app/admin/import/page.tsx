'use client'

import { useState } from 'react'
import Papa from 'papaparse'

type InputRow = {
  asin: string
  name: string
  affiliate_url: string
  category?: string
}

type Product = {
  asin: string
  title: string
  affiliateUrl: string
  category?: string
  imageUrl: string | null
}

export default function ImportProductsPage() {
  const [raw, setRaw] = useState('')
  const [rows, setRows] = useState<InputRow[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedCount, setSavedCount] = useState<number | null>(null)

  function parseCsv(text: string) {
    const parsed = Papa.parse<InputRow>(text.trim(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
    })
    if (parsed.errors?.length) {
      throw new Error(parsed.errors[0].message || 'CSV parse error')
    }
    const required = ['asin', 'name', 'affiliate_url']
    const miss = required.filter((k) => !parsed.meta.fields?.includes(k))
    if (miss.length) {
      throw new Error(`Missing required column(s): ${miss.join(', ')}`)
    }
    const data = (parsed.data || []).map((r) => ({
      asin: String(r.asin || '').trim(),
      name: String(r.name || '').trim(),
      affiliate_url: String(r.affiliate_url || '').trim(),
      category: r.category ? String(r.category).trim() : undefined,
    }))
    const filtered = data.filter((r) => r.asin && r.name && r.affiliate_url)
    return filtered
  }

  async function fetchImages(asins: string[]): Promise<Record<string, string | null>> {
    const uniq = Array.from(new Set(asins.filter(Boolean)))
    if (uniq.length === 0) return {}
    const res = await fetch('/.netlify/functions/amazon-items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || '',
      },
      body: JSON.stringify({ asins: uniq }),
    })
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(`amazon-items ${res.status}: ${msg}`)
    }
    const data = await res.json()
    const items = Array.isArray(data?.items) ? data.items : []
    const map: Record<string, string | null> = {}
    for (const it of items) {
      map[it.asin] = it.image ?? null
    }
    return map
  }

  async function handlePreview() {
    try {
      setError(null)
      setProducts([])
      setSavedCount(null)
      const parsed = parseCsv(raw)
      setRows(parsed)
      setLoading(true)
      const imageMap = await fetchImages(parsed.map((r) => r.asin))
      const out: Product[] = parsed.map((r) => ({
        asin: r.asin,
        title: r.name,
        affiliateUrl: r.affiliate_url,
        category: r.category,
        imageUrl: imageMap[r.asin] ?? null,
      }))
      setProducts(out)
    } catch (e: any) {
      setError(e.message || 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setError(null)
      setLoading(true)
      // If you already have a bulk endpoint, change the URL below to your existing route.
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ products }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Save failed ${res.status}: ${txt}`)
      }
      const json = await res.json()
      setSavedCount(json.saved || products.length)
    } catch (e: any) {
      setError(e.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  function downloadCSV() {
    const csv = Papa.unparse(
      products.map((p) => ({
        asin: p.asin,
        name: p.title,
        affiliate_url: p.affiliateUrl,
        category: p.category || '',
        image_url: p.imageUrl || '',
      }))
    )
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products-enriched.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyJSON() {
    const payload = JSON.stringify(products, null, 2)
    navigator.clipboard.writeText(payload)
  }

  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Import products</h1>
      <p className="text-sm text-gray-600">
        Required columns: asin, name, affiliate_url. Optional: category.
      </p>

      <textarea
        className="w-full h-48 border rounded p-3 font-mono text-sm"
        placeholder="Paste CSV with headers: asin,name,affiliate_url,category"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={handlePreview}
          disabled={loading || !raw.trim()}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? 'Working…' : 'Preview with images'}
        </button>
        <button
          onClick={handleSave}
          disabled={loading || products.length === 0}
          className="px-4 py-2 rounded border"
        >
          Save to catalog
        </button>
        <button
          onClick={downloadCSV}
          disabled={products.length === 0}
          className="px-4 py-2 rounded border"
        >
          Download CSV with image_url
        </button>
        <button
          onClick={copyJSON}
          disabled={products.length === 0}
          className="px-4 py-2 rounded border"
        >
          Copy JSON
        </button>
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {savedCount !== null && (
        <div className="p-3 border bg-green-50 text-green-700 text-sm rounded">
          Saved {savedCount} products.
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border mt-2 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">ASIN</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Affiliate URL</th>
                <th className="p-2 border">Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.asin}>
                  <td className="p-2 border">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.title} className="h-12 w-12 object-contain" />
                    ) : (
                      <span className="text-gray-400">none</span>
                    )}
                  </td>
                  <td className="p-2 border">{p.asin}</td>
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border break-all">{p.affiliateUrl}</td>
                  <td className="p-2 border">{p.category || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Images are fetched live from your secured function using NEXT_PUBLIC_SITE_KEY.
          </p>
        </div>
      )}
    </div>
  )
}
