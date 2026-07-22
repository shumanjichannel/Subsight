import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <h1 className="text-center text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Log in to your SubSight account
        </p>

        {/* Placeholder form */}
        <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <button className="w-full rounded-full bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:opacity-90" disabled>
            Log in
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authentication coming soon — this is a placeholder.
        </p>
      </motion.div>
    </div>
  );
}
