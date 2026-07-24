// Production server for the built SPA + AI API.
// The Vite build emits static client assets into dist/.
// This serves them on port 3000, proxies /api/ai/* to the AI server on port 3001,
// and spawns the AI server as a child process.
//
// Starting a new instance supersedes the old one: it frees both ports
// no matter which user owns the current listener, so publish never collides.
// Every sandbox user has passwordless sudo.
const PORT = 3000;
const AI_PORT = 3001;
const HOST = "0.0.0.0";
const DIST_DIR = `${import.meta.dir}/dist`;

function freePortCmd(port: number): string {
  return (
    `for _ in $(seq 1 25); do ` +
    `pids=$(lsof -t -iTCP:${port} -sTCP:LISTEN 2>/dev/null || true); ` +
    `if [ -z "$pids" ]; then exit 0; fi; ` +
    `kill $pids 2>/dev/null || true; sleep 0.2; ` +
    `done`
  );
}

// ── Start AI API server as a child process ──────────────────────────

const aiProc = Bun.spawn(["bun", "run", "server/ai-api.ts"], {
  cwd: import.meta.dir,
  stdio: ["ignore", "inherit", "inherit"],
  env: { ...process.env },
});
await Bun.sleep(500);
console.log(`AI API server spawned (PID ${aiProc.pid})`);

// ── Proxy helper ────────────────────────────────────────────────────

async function proxyToAi(req: Request): Promise<Response> {
  const url = new URL(req.url);
  url.host = `localhost:${AI_PORT}`;
  url.port = String(AI_PORT);
  url.protocol = "http:";

  try {
    return await fetch(new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.arrayBuffer() : undefined,
    }));
  } catch {
    return new Response(
      JSON.stringify({ reply: "AI assistant is being configured — check back soon." }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
}

// ── Free both ports ─────────────────────────────────────────────────

await Bun.$`sudo sh -c ${freePortCmd(PORT)}`.quiet().nothrow();
await Bun.$`sudo sh -c ${freePortCmd(AI_PORT)}`.quiet().nothrow();

// ── Main HTTP server ────────────────────────────────────────────────

for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePortCmd(PORT)}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const { pathname } = new URL(req.url);

        // Proxy AI API requests to the AI server
        if (pathname.startsWith("/api/ai/")) {
          return proxyToAi(req);
        }

        // Static file (with index.html for "/")
        const normalized = pathname === "/" ? "/index.html" : pathname;
        const file = Bun.file(DIST_DIR + normalized);
        if (await file.exists()) {
          return new Response(file);
        }

        // SPA fallback
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

console.log(`SubSight serving on http://${HOST}:${PORT}`);
