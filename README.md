## BeyondCodeFM (React)

Vanilla React port of the old `headless` Next.js site (Vite + React Router + Tailwind). The site builds to a static `dist/` folder (prerendered routes plus `404.html`) served as [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/). Open Graph images are generated at request time by the Worker in `worker/index.tsx` using [`@cloudflare/pages-plugin-vercel-og`](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/) (`GET /api/og?cover=`).

Coding agents: start at [`AGENTS.md`](AGENTS.md), then [`docs/architecture.md`](docs/architecture.md).

Host: Cloudflare Workers (`beyondcode-fm`).

## Environment

```dotenv
PODCAST_RSS_URL="https://feed.xyzfm.space/nfm8cu8deycn"
NEXT_PUBLIC_OG_URL="https://beyondcodefm.com"
```

The RSS feed is loaded at dev/build time (not by a browser CORS fetch), then pages are server-rendered in `dev` and prerendered on `build`. If the live feed cannot be fetched, the committed fixture at `src/lib/fixtures/feed.xml` is used so the build still produces HTML.

`NEXT_PUBLIC_OG_URL` is the absolute origin baked into `og:image`. Without it, the tag is a relative `/api/og?cover=…` path, which most crawlers will ignore.

## Running locally

```bash
npm install
npm run dev
```

Routes are unprefixed (`/`, `/{episodeId}`). Legacy `/zh-CN` and `/en` URLs redirect to those paths. Theme is light → dark → system (button in the top-right).

`npm run dev` / `npm run preview` serve the static site only. To exercise the OG Worker locally:

```bash
npm run worker:dev
```

Then open `/api/og?cover=` with a real cover URL (the podcast cover from the feed).

## Test / build / preview

```bash
npm test
npm run build
npm run preview
```

## Deploy to Cloudflare Workers

Repo config lives in `wrangler.jsonc` (Worker `beyondcode-fm`, static assets `dist`, `nodejs_compat`). Static asset requests are free and don't invoke the Worker; `assets.run_worker_first` only runs it for `/api/og`.

### Option A — Git integration (recommended)

This is dashboard work you do once. Cloudflare will build on every push.

1. Open [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → **Create** → **Import a repository**.
2. Authorize GitHub and select **`BeyondCodeFM/beyondcode-fm`**.
3. Setup:
   - **Project name:** `beyondcode-fm` (must match `name` in `wrangler.jsonc`)
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** leave empty
4. **Settings → Build → Variables and secrets** (these are read at build time):
   - `PODCAST_RSS_URL` = `https://feed.xyzfm.space/nfm8cu8deycn`
   - `NEXT_PUBLIC_OG_URL` = `https://beyondcodefm.com`
5. Deploy. You get `https://beyondcode-fm.<subdomain>.workers.dev`.

### Option B — CLI from this repo

```bash
npx wrangler login          # once, in the browser
npm run worker:deploy       # builds, uploads dist/ assets + worker/
```

### Custom domain

1. If the domain is still attached to the old Pages project, remove it there first.
2. Worker → **Settings → Domains & Routes** → **Add → Custom domain** → `beyondcodefm.com` (and `www` if you use it). Cloudflare writes the DNS record when the zone is on Cloudflare.
