import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Bell, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Auto-detect subscriptions",
    description: "Connect your bank and SubSight automatically finds every recurring subscription — no manual entry.",
  },
  {
    icon: Bell,
    title: "Smart alerts",
    description: "Get notified before charges hit, when prices increase, or when you're paying for the same thing twice.",
  },
  {
    icon: BarChart3,
    title: "Spending insights",
    description: "See exactly where your money goes each month with clear, beautiful dashboards.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Your subscription command center
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Stop losing money to forgotten subscriptions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            SubSight automatically discovers recurring subscriptions from your bank transactions, flags waste, and alerts you before charges hit.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent"
            >
              View pricing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Take control of your subscriptions
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 * i }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto inline-flex rounded-full bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to find your hidden subscriptions?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The average SubSight user saves €47/month in the first week.
        </p>
        <Link
          to="/signup"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Start saving today <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
