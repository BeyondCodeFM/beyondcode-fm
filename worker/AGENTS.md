# `worker`

Cloudflare Worker entry (`main` in `wrangler.jsonc`), not Vite middleware. `dist/` is the Worker's static assets.

- `index.tsx` — `GET /api/og?cover=`. Validates the cover with `parseCoverUrl`, renders `OgCard` via `ImageResponse`. Any other request falls through to `env.ASSETS`.
- Shares `src/lib/og.ts` and `src/lib/og-image.tsx`. Satori requires `display: flex` on every box.
- `assets.run_worker_first` in `wrangler.jsonc` must stay `["/api/og"]` so the rest of the site is served as static assets without invoking the Worker.
- `nodejs_compat` in `wrangler.jsonc` is required by `@cloudflare/pages-plugin-vercel-og` (its `/api` export runs on plain Workers too).
- Typechecked by `npm run check` (`tsc -p worker`). `types.d.ts` hand-declares the `Env` / handler shapes it uses.
- Local: `npm run worker:dev`. `npm run dev` / `preview` do not run the Worker.
