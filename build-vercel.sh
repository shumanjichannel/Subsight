#!/usr/bin/env bash
# Produce a Vercel Build Output API bundle (.vercel/output) for this SPA.
#
# Since this is a client-side SPA (no SSR), we serve static files with a
# fallback to index.html for client-side routing.
set -euo pipefail
cd "$(dirname "$0")"
umask 002

echo "[1/3] vite build"
bun install
bun run build

echo "[2/3] assemble .vercel/output (Build Output API v3)"
rm -rf .vercel/output
mkdir -p .vercel/output/functions/render.func
cp -R dist .vercel/output/functions/render.func/dist

echo "[3/3] bundle entry into the render function"
bun build vercel-entry.ts --target node \
  --outfile .vercel/output/functions/render.func/index.mjs

cat > .vercel/output/functions/render.func/.vc-config.json <<'JSON'
{ "runtime": "nodejs22.x", "handler": "index.mjs", "launcherType": "Nodejs", "supportsResponseStreaming": true }
JSON
cat > .vercel/output/config.json <<'JSON'
{ "version": 3, "routes": [ { "handle": "filesystem" }, { "src": "/(.*)", "dest": "/render" } ] }
JSON

echo "done -> .vercel/output ready for: bunx vercel deploy --prebuilt"
