# RedPebble Website

Marketing site for **RedPebble** (an AI advisory practice), live at **https://redpebble.ai**.
Static only — HTML, CSS, client-side JS, WebGL. No backend, no build framework.

## Deployment (live setup — reuse, don't recreate)

### GitHub
- Repo: https://github.com/ashishgupta-97065/RedPebble_Website
- Default & production branch: `main`. Pushing to `main` is the deploy trigger.

### Hosting — Cloudflare Workers (static assets)  [NOT Vercel/Pages]
- Connected to the GitHub repo via Cloudflare "Workers Builds" (Git integration).
- Every push to `main` → Cloudflare runs `npx wrangler deploy` → live in ~30s. No manual step.
- Worker/project: `redpebble-website` · Worker URL: https://redpebble-website.ashishgupta97065.workers.dev
- Cloudflare account: ashishgupta97065@gmail.com
- Config: `wrangler.jsonc` at repo root serves `./public`:
      { "name": "redpebble-website", "compatibility_date": "2024-11-01",
        "assets": { "directory": "./public" } }
- Note: Cloudflare's default `html_handling` 307-redirects `*.html` to the extension-less
  path; the DC runtime's `fetch()` follows redirects, so `*.dc.html` views still load fine.

### Domains (Cloudflare-registered, same account)
- redpebble.ai (apex) — canonical, Custom Domain on the Worker.
- www.redpebble.ai → 301 → https://redpebble.ai (proxied CNAME `www` + "WWW to root" Redirect Rule).

## What gets served — `public/` (the DEPLOYED, flattened build)

The site is a "Design Component" (DC) app. The DC runtime (`support.js`) fetches sibling
`*.dc.html` views **by name from the same directory** (`COMPONENT_DIR = "."`). So everything
the entry needs sits flat in `public/`, with shared `assets/` at the root:

```
public/
  index.html                  # the ROUTER (entry). Detects device:
                              #   ?view=mobile / ?view=desktop override, else MOBILE by default.
  main.dc.html                # black liquid-ripple WebGL site (default for all devices)
  skip_pebble.dc.html         # boy-skips-stone WebGL scene (opt-in via "Skip the Pebble" → ?view=desktop)
  privacy.html                # plain static Privacy Policy, served at /privacy (HAND-AUTHORED HERE —
                              #   not in the design-tool zip; keep it when re-flattening). Linked from
                              #   a line under the contact form's Send button in both views.
  terms.html                  # plain static Terms of Service, served at /terms (HAND-AUTHORED HERE, same
                              #   styles as privacy.html). privacy.html §06 + terms.html §04 are the YouTube
                              #   API compliance text (YouTube ToS, Google Privacy Policy, deletion/revoke).
  redpebble-shared.js         # shared logic: sendContact() etc. (CONTACT_EMAIL = ag@redpebble.ai)
  support.js                  # DC runtime (never hand-edit)
  assets/...                  # shared images / 3D models; views reference them as ../assets/...
```

- Views reference `./support.js`, `./redpebble-shared.js` (siblings) and `../assets/...`.
  Served at the site root, `../assets/` resolves to `/assets/` (URL root-clamping) — works.
- Runtime deps load from CDNs at view time (React→unpkg, three.js→cdnjs/jsdelivr, Google Fonts).
  Real browsers fetch these fine; a sandboxed/headless browser may be blocked from them.

## Source vs. deploy

Sources are authored externally (a design tool) and delivered as a zip with this layout:
`code/` (the working folder: `RedPebble Site.dc.html` = entry, the two views, the two .js)
and a shared `code/../assets/`, plus `archive/` (version history — **gitignored, not deployed**).

To deploy a new zip:
1. Flatten `code/` into `public/`: `RedPebble Site.dc.html` → `public/index.html`; copy the two
   `*.dc.html` views + `redpebble-shared.js` + `support.js` as-is (keep exact names); copy
   `assets/` → `public/assets/`.
2. Do NOT deploy `archive/` (kept in `.gitignore`).
3. Keep `public/privacy.html` and `public/terms.html`, and re-add (in both views, if the new zip lacks them):
   - the "By sending, you agree to our Privacy Policy and Terms" line under the Send button;
   - the `.rp-legal` footer strip (YouTube logo + "RedPebble on YouTube" · Privacy Policy · Terms of
     Service). It's YouTube compliance evidence: the homepage must show the Privacy link with YouTube
     branding. Mobile: bottom-centre of the root div; desktop: bottom-right.
4. Commit & push to `main`; Cloudflare auto-rebuilds. Verify at https://redpebble.ai.

## Conventions

- Static & dependency-light. Edit shared cross-platform logic in `redpebble-shared.js`, not per-view.
- Contact: form posts via FormSubmit AJAX to `ag@redpebble.ai` (mailto fallback). FormSubmit needs
  a one-time activation — the first real submission emails a confirmation link to that inbox.
- Palette: black bg, single red accent `#e40f00`; fonts Montserrat (mobile) / Manrope + Cormorant.
