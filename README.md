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

Percent weights are accepted and normalized automatically:

```text
salad:25%
sushi:50%
soup
```

Separators supported:

- half-width commas: `salad,sushi,soup`
- full-width Chinese commas: `沙拉，寿司，汤`
- Chinese enumeration commas: `沙拉、寿司、汤`
- line breaks

## Query Parameters

- `q`: pre-populates the choice list
- `lang`: accepts `en` or `zh`

Example:

```text
/?q=salad:3,sushi:1,soup:4&lang=zh
```

## Storage

The app uses browser local storage only:

- `decisn-history`
- `decisn-language`
- `decisn-animation`
- `decisn-accent`
- `decisn-theme`

There is no sign-in, backend, database, or external randomness service.

## Release

Current version: `0.1.0`

Deployment docs:

- [First deploy](deploy/first-deploy.md)
- [Caddy site block](deploy/Caddyfile.decisn)
- [Security pass](docs/security-pass.md)
