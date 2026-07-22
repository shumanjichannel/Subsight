import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "~/contexts/AuthContext";
import { supabase } from "~/lib/supabase";

export default function AuthCallback() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  // Track whether we've waited long enough for the session to settle
  const [settled, setSettled] = useState(false);
  const settledTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If Supabase redirects back with an error in the URL
  useEffect(() => {
    const errorParam =
      searchParams.get("error") ?? searchParams.get("error_description");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // After loading completes, wait a short grace period for onAuthStateChange
  // to fire. This prevents prematurely redirecting to /login before the
  // session is fully established after an OAuth redirect.
  useEffect(() => {
    if (!loading) {
      // Give Supabase a moment to finish any pending session exchange.
      // We also proactively try getSession() one more time in case the
      // listener hasn't fired yet.
      settledTimer.current = setTimeout(async () => {
        // Re-check the session to catch any late-arriving state
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Force a re-render — user will be picked up from AuthContext
          // on the next render cycle, or we can just mark settled.
        }
        setSettled(true);
      }, 1200);
    }

    return () => {
      if (settledTimer.current) clearTimeout(settledTimer.current);
    };
  }, [loading]);

  // If user is already available, redirect immediately
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Still loading or waiting for session to settle
  if (loading || !settled) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Completing sign in…
          </p>
        </div>
      </div>
    );
  }

  // Error from URL params
  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <p className="mt-3 font-semibold text-destructive">
            Authentication failed
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <a
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  // Settled without a session — OAuth likely failed
  return <Navigate to="/login?error=oauth_failed" replace />;
}
