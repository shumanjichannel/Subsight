// Vercel Build Output API function entry for SPA.
//
// For a client-side SPA, we serve static files with a fallback to index.html.
// This adapts Vercel's Node (req, res) handler to serve files from dist/.
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const DIST_DIR = join(import.meta.dirname ?? ".", "dist");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function getMime(path: string): string {
  const ext = path.slice(path.lastIndexOf("."));
  return MIME[ext] ?? "application/octet-stream";
}

export default async function vercelHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    let filePath = join(DIST_DIR, url.pathname);

    // Try the path as-is, or index.html for directories
    try {
      const s = await stat(filePath);
      if (s.isDirectory()) filePath = join(filePath, "index.html");
    } catch {
      // SPA fallback: serve index.html for any unmatched route
      filePath = join(DIST_DIR, "index.html");
    }

    const content = await readFile(filePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", getMime(filePath));
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(content);
  } catch {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
}
