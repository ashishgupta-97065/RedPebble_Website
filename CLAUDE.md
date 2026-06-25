# RedPebble Website

Marketing / landing site for **RedPebble** (an AI advisory practice), live at
**https://redpebble.ai**.

## What this project is

- A **static website** — HTML, CSS, client-side JS, and WebGL only.
- **No server-side code, no backend, no build framework.** It is served as plain
  static assets. Keep it that way unless explicitly asked to add tooling.
- Currently a single "coming soon" landing page; it will grow into a fuller site
  over time (still static).

## Repository layout

```
.
├── public/            # everything served to the browser lives here
│   └── index.html     # the landing page (currently the whole site)
├── wrangler.jsonc     # Cloudflare config: serve ./public as static assets
└── CLAUDE.md          # this file
```

- **All site files go in `public/`** — HTML, CSS, JS, images, WebGL assets, etc.
- Reference assets with **relative paths** (e.g. `./styles.css`, `./js/app.js`,
  `./assets/model.glb`) so they resolve correctly when served.
- Do **not** move files out of `public/` or rename it — `wrangler.jsonc` points
  the asset directory at `./public`.

## Hosting & deployment

- Hosted on **Cloudflare Workers (static assets)**, connected to this GitHub repo
  via Cloudflare's Git integration ("Workers Builds").
- **Deploys automatically on every push to `main`.** Push to `main` → Cloudflare
  runs `npx wrangler deploy` → site is live in ~30 seconds. No manual deploy step.
- `main` is the default branch and the production branch.
- The Cloudflare project is named `redpebble-website`. The default Worker URL is
  `redpebble-website.ashishgupta97065.workers.dev` (the real site is the custom
  domain below).

## Domains

- **`redpebble.ai`** (apex) — serves the site. This is the canonical URL.
- **`www.redpebble.ai`** — 301-redirects to `https://redpebble.ai` (handled by a
  Cloudflare Redirect Rule + a proxied `www` CNAME). Do not change this without
  asking; the apex is canonical.

## How to make changes

1. Edit / add files inside `public/`.
2. For small tweaks, committing to `main` is fine (it auto-deploys).
   For larger changes, work on a feature branch and open a PR into `main`.
3. After pushing to `main`, the live site updates automatically.

## Local preview

It's a static site, so you can just open `public/index.html` in a browser.
To preview exactly as Cloudflare serves it (with the assets routing):

```
npx wrangler dev
```

## Conventions

- Keep it dependency-light and static. Prefer vanilla HTML/CSS/JS and inline or
  relative-linked assets over adding bundlers/frameworks unless asked.
- Match the existing visual style (dark background `#0a0c0f`, the single red
  "pebble" accent `#e02b1d`, Fraunces serif for headings, IBM Plex Mono for
  small/eyebrow text). See `public/index.html` for the established palette and
  type choices.
