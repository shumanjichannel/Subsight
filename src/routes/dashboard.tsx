import { motion } from "framer-motion";
import { BarChart3, CreditCard, TrendingDown, AlertCircle } from "lucide-react";

const stats = [
  { icon: CreditCard, label: "Active subscriptions", value: "—" },
  { icon: TrendingDown, label: "Monthly spend", value: "—" },
  { icon: AlertCircle, label: "Price increases detected", value: "—" },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Your subscription overview at a glance.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="inline-flex rounded-full bg-primary/10 p-2 text-primary">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder chart area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-8 rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Monthly spending</h2>
        </div>
        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
          <p className="text-sm text-muted-foreground">
            Connect a bank account to see your subscription data here.
          </p>
        </div>
      </motion.div>

      {/* Placeholder subscriptions list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-8 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-semibold">Your subscriptions</h2>
        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
          <p className="text-sm text-muted-foreground">
            No subscriptions detected yet. Connect a bank to get started.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
