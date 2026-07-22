import { Outlet, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function RootLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-2xl">🔍</span>
            <span>SubSight</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
            <Link to="/pricing" className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              Pricing
            </Link>
            <Link to="/login" className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              Log in
            </Link>
            <Link to="/signup" className="ml-2 rounded-full bg-primary px-4 py-1.5 text-primary-foreground transition-colors hover:opacity-90">
              Sign up free
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="hidden h-4 w-4 dark:block" />
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-1 sm:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="hidden h-4 w-4 dark:block" />
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-border px-4 pb-4 sm:hidden">
            <nav className="flex flex-col gap-1 pt-2">
              <Link to="/pricing" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                Pricing
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="mt-1 rounded-full bg-primary px-4 py-2 text-center text-primary-foreground transition-colors hover:opacity-90">
                Sign up free
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SubSight. All rights reserved.</p>
      </footer>
    </div>
  );
}
