# Static Deployment Guide

Decisn is a static app. Deploy the files with any static host that can serve HTML, CSS, JavaScript, and SVG assets over HTTPS.

## Files

Publish these files from the repository root:

```text
index.html
app.js
styles.css
manifest.webmanifest
LICENSE
assets/
```

No build step, server runtime, database, sign-in system, or environment variables are required.

## Preflight

From the repository root:

```bash
node --check app.js
```

Optional local preview:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/?q=salad,sushi,soup&lang=zh
```

## Hosting

Any static host is suitable, including:

- Caddy
- Nginx
- Apache
- GitHub Pages
- Netlify
- Cloudflare Pages
- object storage with static website hosting

If using Caddy, adapt the example site block in:

```text
deploy/Caddyfile.decisn
```

Replace the example domain and root path with your own values.

## Recommended Headers

Use HTTPS and set conservative static-site headers where your host supports them:

- `Content-Security-Policy`
- `Permissions-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Strict-Transport-Security` after HTTPS is confirmed working

## Verify

Manual checks after deployment:

- query loading with `?q=salad,sushi,soup&lang=zh&animation=wheel`
- language selector
- comma, Chinese comma, and line-break parsing
- numeric, decimal, fraction, and percent weights
- wheel weighted regions
- slot reel selection
- copy link
- share result image
- download result image
- history persistence after reload
- clear history
- light, dark, and system theme
- accent color selection

## Rollback

Rollback is static-file replacement. Redeploy a previous Git commit or restore a previous copy of the published static directory.
