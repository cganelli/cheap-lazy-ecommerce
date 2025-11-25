# Content Security Policy (CSP) Issues and Solutions

## Current Issues

### 1. Google Drive CSP Violations

**Problem:** Google Drive has its own Content Security Policy that restricts embedding. When you embed Google Drive preview URLs, you may see console errors like:

```
Framing 'https://drive.google.com/' violates the following Content Security Policy directive: 'frame-ancestors https://drive.google.com'
```

**Explanation:** Google Drive sets `frame-ancestors https://drive.google.com` on its content, which means it can only be embedded on `drive.google.com` itself. This is a Google Drive security feature, not an issue with our site's CSP.

**Impact:** 
- These are **warnings**, not blocking errors
- Google Drive preview videos should still work when embedded with `?rm=minimal&embedded=true` parameters
- The videos will load and play, but you'll see console warnings

**Solution Options:**
1. **Accept the warnings** (recommended) - The videos work despite the warnings
2. **Use direct video URLs** - Host videos elsewhere (YouTube, Vimeo, your own CDN)
3. **Use Google Drive's embed API** - More complex but might avoid some CSP issues

### 2. 404 Errors for Next.js Static Files

**Problem:** In development, you may see 404 errors for:
- `layout.css`
- `main-app.js`
- `app-pages-internals.js`

**Explanation:** These are Next.js internal files that are generated during build. In development mode with `next dev`, these files are served dynamically and may not always be available immediately.

**Impact:**
- Development-only issue
- Should not occur in production builds
- May cause styling issues in dev mode

**Solution:**
- Restart the dev server: `npm run dev`
- Clear `.next` folder: `rm -rf .next && npm run dev`
- These errors should not appear in production builds

### 3. Font Preload Warnings

**Problem:** Warnings about preloaded fonts not being used:
```
The resource .../e4af272ccee01ff0-s.p.woff2 was preloaded using link preload but not used within a few seconds
```

**Explanation:** Next.js automatically preloads fonts, but sometimes the timing doesn't match browser expectations.

**Impact:**
- Minor performance warning
- Does not affect functionality
- Fonts still load correctly

**Solution:**
- This is a Next.js optimization issue, not a critical error
- Can be ignored or reported to Next.js team

## Our CSP Configuration

Our CSP (in `public/_headers`) is configured to:
- ✅ Allow Google Drive iframes (`frame-src 'self' https://drive.google.com https://accounts.google.com`)
- ✅ Allow Google Drive scripts and styles
- ✅ Prevent our site from being embedded elsewhere (`frame-ancestors 'none'`)
- ✅ Block XSS attacks
- ✅ Prevent clickjacking

## Recommendations

1. **For Production:** The CSP warnings from Google Drive are expected and can be safely ignored if videos are working
2. **For Development:** Restart the dev server if you see 404 errors
3. **For Better UX:** Consider hosting videos on a platform that allows embedding (YouTube, Vimeo) if the warnings are concerning

## Testing

To verify everything works:
1. Open a review modal with a Google Drive video
2. Verify the video plays (despite console warnings)
3. Check that the site's security headers are present in production

