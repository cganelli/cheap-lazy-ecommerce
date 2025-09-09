# Environment Variables Setup

## Required Environment Variables

### For Netlify Dashboard (Site settings > Environment variables):
```
SITE_KEY=replace-with-a-long-random-string
```

### For Local Development (.env.local):
```
NEXT_PUBLIC_SITE_KEY=replace-with-the-same-long-random-string
```

## Instructions:
1. Generate a long random string (at least 32 characters)
2. Set the same value for both SITE_KEY and NEXT_PUBLIC_SITE_KEY
3. Add SITE_KEY to Netlify dashboard
4. Add NEXT_PUBLIC_SITE_KEY to your local .env.local file
