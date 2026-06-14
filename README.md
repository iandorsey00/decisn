# Decisn / 帮我选

Decisn is a small local-first decision picker. It supports English and Simplified Chinese, comma-separated or line-separated choices, optional weights, local decision history, shareable URLs, and a brief slot-machine or wheel-style reveal animation.

## Usage

Open `index.html` in a browser, or serve the directory with any static file server.

Examples:

```text
salad, sushi, soup
```

```text
salad
sushi
soup
```

```text
salad:3
sushi:1
soup:4
```

Decimal, fraction, and percent weights are accepted and normalized automatically:

```text
salad:25%
sushi:1/365
soup
```

Whitespace around labels, colons, fractions, and percent signs is okay. Parentheses around a weight are also okay, such as `sushi:(1/365)`.

Separators supported:

- half-width commas: `salad,sushi,soup`
- full-width Chinese commas: `沙拉，寿司，汤`
- Chinese enumeration commas: `沙拉、寿司、汤`
- line breaks

Literal comma separators inside an option can be escaped with a backslash, such as `\,`, `\，`, or `\、`. Literal backslashes can be escaped with `\\`.

## Query Parameters

- `q`: pre-populates the choice list
- `lang`: accepts `en` or `zh`
- `animation`: accepts `slot` or `wheel`

Example:

```text
/?q=salad:3,sushi:1,soup:4&lang=zh&animation=wheel
```

If `lang` is omitted, Decisn uses the saved language preference when present. On first visit, browsers or operating systems reporting a Chinese locale default to Simplified Chinese.

## Storage

The app uses browser local storage only:

- `decisn-history`
- `decisn-language`
- `decisn-animation`
- `decisn-accent`
- `decisn-theme`

There is no sign-in, backend, database, or external randomness service.

## Release

Current version: `0.1.1`

Project docs:

- [Static deployment guide](deploy/first-deploy.md)
- [Daily ops](deploy/daily-ops.md)
- [Example Caddy site block](deploy/Caddyfile.decisn)
- [Security pass](docs/security-pass.md)
