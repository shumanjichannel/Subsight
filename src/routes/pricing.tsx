import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for getting started.",
    features: [
      "1 bank connection",
      "Up to 20 subscriptions",
      "Basic dashboard",
      "Manual refresh",
    ],
    cta: "Get started",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "€7.99",
    period: "/month",
    description: "For power users who want full control.",
    features: [
      "Unlimited bank connections",
      "Unlimited subscriptions",
      "AI assistant",
      "Price-increase tracking",
      "Email & push notifications",
      "CSV export",
    ],
    cta: "Start free trial",
    href: "/signup",
    featured: true,
  },
  {
    name: "Team",
    price: "€19",
    period: "/month",
    description: "For families and small businesses.",
    features: [
      "Everything in Pro",
      "Shared workspace",
      "Family / business subscriptions",
      "Admin controls",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Start free, upgrade when you need more. No hidden fees.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className={`relative flex flex-col rounded-xl border p-6 ${
              tier.featured
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-card"
            }`}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <div>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className="text-muted-foreground">{tier.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {tier.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link
              to={tier.href}
              className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                tier.featured
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border hover:bg-accent"
              }`}
            >
              {tier.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Pricing is illustrative — payments coming soon.
      </p>
    </div>
  );
}
