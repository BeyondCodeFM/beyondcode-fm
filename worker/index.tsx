/**
 * Worker entry. `dist/` is served as static assets; `run_worker_first` in
 * wrangler.jsonc sends only /api/og here. Everything else falls through to ASSETS.
 */

import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

import { OgCard } from '../src/lib/og-image'
import { OG_HEIGHT, OG_WIDTH, parseCoverUrl } from '../src/lib/og'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/og' && request.method === 'GET') {
      return ogImage(url)
    }
    return env.ASSETS.fetch(request)
  },
} satisfies WorkerHandler<Env>

function ogImage(url: URL): Response {
  const cover = parseCoverUrl(url.searchParams.get('cover'))
  if (!cover) {
    return new Response('Missing or invalid cover URL', { status: 400 })
  }

  return new ImageResponse(<OgCard cover={cover} />, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
  })
}
