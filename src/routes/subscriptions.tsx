import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  SlidersHorizontal,
  X,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  Landmark,
  Banknote,
  Calendar,
  Clock,
  ExternalLink,
  Plug,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  subscriptions,
  categories,
  categoryColors,
  categoryAvatarColors,
  detectedSubscriptions,
  sortOptions,
  type SubscriptionItem,
  type SubscriptionStatus,
  type SortOption,
} from "~/lib/subscriptions-data";

const statusStyles: Record<SubscriptionStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  paused: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  unknown: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const statusDot: Record<SubscriptionStatus, string> = {
  active: "bg-emerald-500",
  paused: "bg-amber-500",
  cancelled: "bg-red-500",
  unknown: "bg-gray-400",
};

const paymentIcons: Record<string, React.ElementType> = {
  Visa: CreditCard,
  Mastercard: CreditCard,
  PayPal: Wallet,
  "Direct Debit": Building2,
  "Apple Pay": Smartphone,
};

function getPaymentIcon(method: string): React.ElementType {
  for (const [key, icon] of Object.entries(paymentIcons)) {
    if (method.startsWith(key)) return icon;
  }
  return Banknote;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("amount-desc");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = [...subscriptions];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((s) => s.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((s) => s.merchant.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case "amount-desc":
        result.sort((a, b) => b.monthlyAmount - a.monthlyAmount);
        break;
      case "amount-asc":
        result.sort((a, b) => a.monthlyAmount - b.monthlyAmount);
        break;
      case "next-payment":
        result.sort((a, b) => {
          if (a.nextPayment === "—") return 1;
          if (b.nextPayment === "—") return -1;
          return a.nextPayment.localeCompare(b.nextPayment);
        });
        break;
      case "name":
        result.sort((a, b) => a.merchant.localeCompare(b.merchant));
        break;
    }

    return result;
  }, [search, activeCategory, sort]);

  const monthlyTotal = useMemo(
    () =>
      subscriptions
        .filter((s) => s.status === "active")
        .reduce((sum, s) => sum + s.monthlyAmount, 0),
    [],
  );

  const yearlyTotal = useMemo(
    () =>
      subscriptions
        .filter((s) => s.status === "active")
        .reduce((sum, s) => sum + s.yearlyEquivalent, 0),
    [],
  );

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const totalCount = subscriptions.length;

  const filterCount =
    (activeCategory !== "All" ? 1 : 0) + (search.trim() ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
  }

  function toggleExpand(id: number) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Subscriptions
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track all your recurring payments in one place.
            </p>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>
        </div>
      </motion.div>

      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-6 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4 shadow-sm lg:gap-4 lg:p-5"
      >
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight lg:text-3xl">
            {totalCount}
          </p>
          <p className="text-xs text-muted-foreground lg:text-sm">
            subscriptions
            {activeCount !== totalCount && (
              <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                ({activeCount} active)
              </span>
            )}
          </p>
        </div>
        <div className="border-x border-border text-center">
          <p className="text-2xl font-bold tracking-tight lg:text-3xl">
            €{monthlyTotal.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground lg:text-sm">
            monthly total
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight lg:text-3xl">
            €{yearlyTotal.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground lg:text-sm">
            yearly total
          </p>
        </div>
      </motion.div>

      {/* Auto-detection banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm lg:p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold lg:text-base">
                Auto-Detection
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
                Connect your bank to automatically discover and track all your
                recurring subscriptions.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex -space-x-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-muted-foreground">
                P
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-muted-foreground">
                T
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-muted-foreground">
                G
              </div>
            </div>
            <Button size="sm" variant="outline" className="shrink-0">
              <Plug className="h-3.5 w-3.5" />
              Connect Bank
            </Button>
          </div>
        </div>

        {/* Detected samples */}
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {detectedSubscriptions.map((ds) => (
            <div
              key={ds.id}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
                  categoryAvatarColors[ds.category],
                )}
              >
                {ds.logo}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{ds.merchant}</p>
                <p className="text-[11px] text-muted-foreground">
                  €{ds.monthlyAmount.toFixed(2)}/mo
                </p>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 text-[10px]"
              >
                {ds.confidence}% match
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground sm:block" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter count badge */}
          {filterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-xs"
            >
              Clear filters
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {filterCount}
              </Badge>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Category filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {["All", ...categories].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {cat}
              {cat === "All" && isActive && (
                <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]">
                  {totalCount}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Subscription cards grid */}
      {filtered.length > 0 ? (
        <motion.div
          key={`${activeCategory}-${sort}`}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                sub={sub}
                isExpanded={expandedId === sub.id}
                onToggle={() => toggleExpand(sub.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-4 py-16 text-center"
        >
          <div className="mb-4 inline-flex rounded-full bg-muted p-4 text-muted-foreground">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold">No subscriptions found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search || activeCategory !== "All"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You haven't added any subscriptions yet. Connect your bank or add one manually."}
          </p>
          {(search || activeCategory !== "All") && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}

function SubscriptionCard({
  sub,
  isExpanded,
  onToggle,
}: {
  sub: SubscriptionItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const PaymentIcon = getPaymentIcon(sub.paymentMethod);

  return (
    <motion.div
      variants={cardItem}
      layout
      onClick={onToggle}
      className={cn(
        "group cursor-pointer rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        isExpanded && "shadow-md ring-1 ring-primary/20",
      )}
    >
      {/* Card header */}
      <div className="flex items-start gap-3 p-4 lg:p-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg lg:h-11 lg:w-11",
            categoryAvatarColors[sub.category],
          )}
        >
          {sub.logo}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold lg:text-base">
              {sub.merchant}
            </h3>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium lg:text-xs",
                statusStyles[sub.status],
              )}
            >
              <span
                className={cn("inline-block h-1.5 w-1.5 rounded-full", statusDot[sub.status])}
              />
              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight lg:text-xl">
              €{sub.monthlyAmount.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">/mo</span>
            <span className="text-xs text-muted-foreground">
              · €{sub.yearlyEquivalent.toFixed(2)}/yr
            </span>
          </div>
        </div>
      </div>

      {/* Card meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border px-4 py-3 text-xs text-muted-foreground lg:px-5">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>
            {sub.nextPayment === "—" ? "No upcoming" : sub.nextPayment}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <PaymentIcon className="h-3 w-3" />
          <span>{sub.paymentMethod}</span>
        </div>
      </div>

      {/* Category badge row */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-2.5 lg:px-5">
        <Badge
          variant="secondary"
          className={cn("text-[10px] lg:text-xs", categoryColors[sub.category])}
        >
          {sub.category}
        </Badge>
        <Badge variant="outline" className="text-[10px] lg:text-xs">
          <Clock className="mr-1 h-2.5 w-2.5" />
          {sub.renewalFrequency}
        </Badge>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-3 lg:px-5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Monthly</p>
                  <p className="mt-0.5 font-medium">
                    €{sub.monthlyAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Yearly</p>
                  <p className="mt-0.5 font-medium">
                    €{sub.yearlyEquivalent.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Payment</p>
                  <p className="mt-0.5 font-medium">{sub.lastPayment}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="mt-0.5 font-medium">{sub.nextPayment}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="mt-0.5 font-medium">{sub.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Frequency</p>
                  <p className="mt-0.5 font-medium">{sub.renewalFrequency}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  Details
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand indicator */}
      <div className="flex items-center justify-center border-t border-border py-1.5 text-[10px] text-muted-foreground transition-colors group-hover:text-foreground lg:text-xs">
        {isExpanded ? "Show less" : "Click for details"}
      </div>
    </motion.div>
  );
}
