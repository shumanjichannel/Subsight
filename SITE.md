# SubSight

SubSight is a subscription cost analyzer — a Vite + React Router v7 SPA
(React + TypeScript + TailwindCSS + shadcn/ui), served on **port 3000**.

## Layout

```
src/
  main.tsx          # app entry: BrowserRouter, QueryClient, ThemeProvider
  root.tsx          # root layout: header, nav, dark mode toggle, <Outlet>
  lib/utils.ts      # shadcn/ui cn() utility
  routes/
    landing.tsx      # "/" — hero, features, CTA
    login.tsx        # "/login" — placeholder auth form
    signup.tsx       # "/signup" — placeholder signup form
    dashboard.tsx    # "/dashboard" — stats grid, chart placeholder
    pricing.tsx      # "/pricing" — three-tier pricing cards
  styles/app.css     # Tailwind v4 + shadcn/ui CSS variables + dark mode
index.html           # Vite SPA shell
vite.config.ts       # Vite + React + Tailwind, port 3000
```

Add a page by creating a new file under `src/routes/` and adding a `<Route>`
in `src/main.tsx`.

## Tech stack

- **Vite** (build tool + dev server)
- **React Router v7** (`react-router-dom`) — client-side routing
- **TypeScript**
- **TailwindCSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** — CSS-variable-based theming with Tailwind v4 `@theme`
- **next-themes** — dark mode (`class` strategy, system-aware)
- **@tanstack/react-query** — server state
- **framer-motion** — animations
- **lucide-react** — icons
- **Bun** — package manager

## Publishing changes

After editing, run:

```bash
bun run publish
```

This rebuilds the site and restarts the production server on port 3000. The
production server (serve.ts) serves static files from `dist/` with SPA
fallback (all unmatched routes → index.html).

## Dev server

```bash
bun run dev
```

Starts Vite dev server with HMR on port 3000.

## Going live (production hosting)

```bash
export VERCEL_TOKEN=...
bun run go-live
```

Builds and deploys the SPA to Vercel via Build Output API.
