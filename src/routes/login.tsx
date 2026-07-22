import { useState, useEffect, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "~/contexts/AuthContext";
import { Button } from "~/components/ui/button";

type AuthAction = "login" | "reset-request" | "reset-sent" | "recovery-form" | "signup-verify" | "invite-accept";

export default function Login() {
  const {
    user,
    loading: authLoading,
    signIn,
    signInWithGoogle,
    resetPasswordForEmail,
    verifyOtp,
    updatePassword,
    configured,
  } = useAuth();

  const [searchParams] = useSearchParams();

  // Determine initial view from URL params
  const typeParam = searchParams.get("type");
  const tokenHash = searchParams.get("token_hash");
  const errorParam = searchParams.get("error");

  const getInitialAction = (): AuthAction => {
    if (errorParam) return "login";
    if (typeParam === "recovery" && tokenHash) return "recovery-form";
    if (typeParam === "signup" && tokenHash) return "signup-verify";
    if (typeParam === "invite" && tokenHash) return "invite-accept";
    return "login";
  };

  const [action, setAction] = useState<AuthAction>(getInitialAction);

  // Email/password login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Recovery / signup / invite
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Shared state
  const [error, setError] = useState(errorParam ? decodeURIComponent(errorParam) : "");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-verify signup and invite tokens on mount
  useEffect(() => {
    const t = typeParam;
    const h = tokenHash;
    if (!t || !h) return;
    if (t !== "signup" && t !== "invite") return;

    const autoVerify = async () => {
      setSubmitting(true);
      const { error: err } = await verifyOtp(h, t as "signup" | "invite");
      if (err) {
        setError(err);
        setAction("login");
      } else {
        setSuccess(true);
        setSuccessMessage(
          t === "signup"
            ? "Your email has been verified! You're now signed in."
            : "You've accepted the invitation! You're now signed in.",
        );
      }
      setSubmitting(false);
    };

    autoVerify();
  }, [typeParam, tokenHash, verifyOtp]);

  // Already logged in — bounce to dashboard
  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setSubmitting(false);
  };

  const handleResetRequest = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }
    setError("");
    setSubmitting(true);
    const { error: err } = await resetPasswordForEmail(email);
    if (err) {
      setError(err);
    } else {
      setAction("reset-sent");
    }
    setSubmitting(false);
  };

  const handleSetNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    // Step 1: verify the OTP token
    const { error: verifyErr } = await verifyOtp(tokenHash!, "recovery");
    if (verifyErr) {
      setError(verifyErr);
      setSubmitting(false);
      return;
    }

    // Step 2: update the password
    const { error: updateErr } = await updatePassword(newPassword);
    if (updateErr) {
      setError(updateErr);
      setSubmitting(false);
      return;
    }

    // Success!
    setSuccess(true);
    setSuccessMessage("Your password has been reset! Redirecting to dashboard…");
    setSubmitting(false);
  };

  if (!configured) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full text-center">
          <h1 className="text-3xl font-bold tracking-tight">Auth not configured</h1>
          <p className="mt-3 text-muted-foreground">
            Set <code className="rounded bg-muted px-1 text-sm">VITE_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-muted px-1 text-sm">VITE_SUPABASE_ANON_KEY</code> in your
            environment to enable authentication.
          </p>
        </motion.div>
      </div>
    );
  }

  // ---- SUCCESS STATE (after recovery / signup verify / invite) ----
  if (success) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full text-center"
        >
          <div className="rounded-xl border border-border bg-card p-8">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-bold">Success!</h2>
            <p className="mt-2 text-muted-foreground">{successMessage}</p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- SIGNUP / INVITE VERIFYING STATE ----
  if (action === "signup-verify" || action === "invite-accept") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full text-center"
        >
          <div className="rounded-xl border border-border bg-card p-8">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">
              {action === "signup-verify" ? "Verifying your email…" : "Accepting invitation…"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              Please wait a moment while we confirm your identity.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* ---- PASSWORD RESET FORM ---- */}
        {action === "recovery-form" ? (
          <>
            <h1 className="text-center text-3xl font-bold tracking-tight">Set new password</h1>
            <p className="mt-2 text-center text-muted-foreground">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSetNewPassword} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium" htmlFor="new-password">
                  New password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirm new password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirm-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set new password"}
              </Button>
            </form>
          </>
        ) : action === "reset-sent" ? (
          /* ---- RESET EMAIL SENT ---- */
          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
            <p className="mt-3 font-semibold">Check your email</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => { setAction("login"); setError(""); }}
            >
              Back to login
            </Button>
          </div>
        ) : action === "reset-request" ? (
          /* ---- FORGOT PASSWORD FORM ---- */
          <form onSubmit={(e) => { e.preventDefault(); handleResetRequest(); }} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium" htmlFor="reset-email">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </Button>
            <button
              type="button"
              onClick={() => { setAction("login"); setError(""); }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Back to login
            </button>
          </form>
        ) : (
          /* ---- DEFAULT LOGIN FORM ---- */
          <>
            <h1 className="text-center text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-center text-muted-foreground">
              Log in to your SubSight account
            </p>

            {/* OAuth buttons */}
            <div className="mt-8 space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={signInWithGoogle}
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Email / password form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAction("reset-request")}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full rounded-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
              </Button>
            </form>
          </>
        )}

        {action !== "recovery-form" && action !== "reset-sent" && action !== "reset-request" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
