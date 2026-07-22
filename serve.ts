// Production server for the built SPA. The Vite build emits static client assets
// into dist/. This wraps them in a Bun server on port 3000 — serving static files
// first, then falling back to index.html for client-side routing.
//
// Starting a new instance supersedes the old one: it frees the port no matter
// which user owns the current server, so publish never collides with an
// already-running server. Every sandbox user has passwordless sudo.
const PORT = 3000;
const HOST = "0.0.0.0";
const DIST_DIR = `${import.meta.dir}/dist`;

// Free PORT regardless of which user owns the current listener.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

// Take over the port, re-freeing and retrying if another publish grabbed it.
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const { pathname } = new URL(req.url);

        // Try to serve as a static file first (with index.html for "/")
        const normalized = pathname === "/" ? "/index.html" : pathname;
        const file = Bun.file(DIST_DIR + normalized);
        if (await file.exists()) {
          return new Response(file);
        }

        // SPA fallback: serve index.html for any unmatched route
        const indexFile = Bun.file(DIST_DIR + "/index.html");
        if (await indexFile.exists()) {
          return new Response(indexFile);
        }

        return new Response("Not Found", { status: 404 });
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

console.log(`SubSight serving on http://${HOST}:${String(PORT)}`);
