# Security Pass

Date: 2026-06-13

## Scope

Initial Decisn MVP:

- static HTML, CSS, and JavaScript
- no backend
- no authentication
- no accounts
- no database
- no external randomness service
- local storage for browser-local history and preferences
- Web Crypto API for random selection
- generated result images through local canvas APIs

## Data Handling

Stored locally in the user's browser:

- `decisn-history`
- `decisn-language`
- `decisn-animation`
- `decisn-accent`
- `decisn-theme`

No app data is sent to a server by the application code.

Share links encode choices in the URL query string. Users should treat shared URLs as containing the choice text they entered.

## Browser APIs

Used APIs:

- `crypto.getRandomValues()` for random selection
- `localStorage` for local history and settings
- `navigator.clipboard` for copying share links
- `canvas.toBlob()` and object URLs for result image download
- `navigator.share` and `navigator.canShare` when available for image sharing

These APIs are browser-local and do not require application secrets.

## Deployment Security

Recommended Caddy controls:

- HTTPS via Caddy automatic certificates
- `encode gzip zstd`
- restrictive Content Security Policy
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- restrictive Permissions Policy
- HSTS after TLS is confirmed working

The app has no server-side secrets or environment files.

## Review Notes

- Weighted and percent choices are normalized locally.
- The wheel visualization reflects weighted probabilities.
- The slot reel remains visually equal-choice; weights affect the final selection only.
- Generated images are produced locally from the current result.
- No third-party scripts, fonts, analytics, or network services are referenced.

Residual risk:

- Shared URLs expose choice text to whoever receives the URL.
- Browser history may retain URLs containing choices.
