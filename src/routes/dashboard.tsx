import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  BarChart3,
  Layers,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "~/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  stats,
  monthlySpending,
  categoryBreakdown,
  recentSubscriptions,
  insights,
  upcomingCharges,
} from "~/lib/dashboard-data";
import { SubscriptionLogo } from "~/lib/subscription-logos";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  BarChart3,
  Layers,
  Clock,
  AlertTriangle,
  TrendingUp,
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuth();
  const displayName =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "there";

  const totalCategoryValue = useMemo(
    () => categoryBreakdown.reduce((sum, c) => sum + c.value, 0),
    [],
  );

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground lg:text-base">
          Here&apos;s your subscription overview for July 2026.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:mb-8 lg:grid-cols-4 lg:gap-4"
      >
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? Calendar;
          return (
            <motion.div key={stat.label} variants={fadeUpItem}>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-3 p-4 lg:p-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                        stat.trendUp
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
                      )}
                    >
                      {stat.trendUp ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight lg:text-2xl">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground lg:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mb-6 grid gap-4 lg:mb-8 lg:grid-cols-5"
      >
        {/* Monthly spending line chart */}
        <motion.div variants={fadeUpItem} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Monthly Spending
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Last 12 months
              </Badge>
            </CardHeader>
            <CardContent className="pl-1 pr-4 pb-4">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={monthlySpending}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    className="text-xs text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-xs text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `€${v}`}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      fontSize: "0.875rem",
                    }}
                    formatter={(value: number) => [`€${value}`, "Spending"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "hsl(var(--primary))",
                      stroke: "hsl(var(--card))",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category breakdown donut */}
        <motion.div variants={fadeUpItem} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      fontSize: "0.875rem",
                    }}
                    formatter={(value: number, _name: string, entry: { payload: { name: string; value: number } }) => {
                      const pct = ((value / totalCategoryValue) * 100).toFixed(1);
                      return [`€${value} (${pct}%)`, entry.payload.name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                {categoryBreakdown.slice(0, 8).map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom row: recent subscriptions + insights + upcoming */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 lg:grid-cols-3"
      >
        {/* Recent subscriptions */}
        <motion.div variants={fadeUpItem} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">
                Recent Subscriptions
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to="/subscriptions"
                  className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-2 pl-4 font-medium lg:pl-6">
                        Merchant
                      </th>
                      <th className="hidden py-2 font-medium sm:table-cell">
                        Amount
                      </th>
                      <th className="hidden py-2 font-medium md:table-cell">
                        Next Payment
                      </th>
                      <th className="hidden py-2 font-medium lg:table-cell">
                        Category
                      </th>
                      <th className="py-2 pr-4 font-medium lg:pr-6">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubscriptions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/30"
                      >
                        <td className="py-3 pl-4 lg:pl-6">
                          <div className="flex items-center gap-3">
                            <SubscriptionLogo
                              merchant={sub.merchant}
                              size="h-9 w-9"
                              className="rounded-lg"
                            />
                            <span className="font-medium">{sub.merchant}</span>
                          </div>
                        </td>
                        <td className="hidden py-3 font-medium sm:table-cell">
                          €{sub.amount.toFixed(2)}
                        </td>
                        <td className="hidden py-3 text-muted-foreground md:table-cell">
                          {sub.nextPayment}
                        </td>
                        <td className="hidden py-3 lg:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {sub.category}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 lg:pr-6">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                              sub.status === "active" &&
                                "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
                              sub.status === "paused" &&
                                "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
                              sub.status === "cancelled" &&
                                "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-1.5 w-1.5 rounded-full",
                                sub.status === "active" && "bg-emerald-500",
                                sub.status === "paused" && "bg-amber-500",
                                sub.status === "cancelled" && "bg-red-500",
                              )}
                            />
                            {sub.status.charAt(0).toUpperCase() +
                              sub.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column: insights + upcoming charges */}
        <motion.div variants={fadeUpItem} className="flex flex-col gap-4">
          {/* Quick insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {insights.map((insight, i) => {
                const Icon = iconMap[insight.icon] ?? TrendingUp;
                return (
                  <div
                    key={i}
                    className="flex gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={cn(
                          "inline-flex rounded-full p-1.5",
                          i === 0 &&
                            "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
                          i === 1 &&
                            "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                          i === 2 &&
                            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{insight.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming charges */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Upcoming Charges
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {upcomingCharges.map((charge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <SubscriptionLogo
                    merchant={charge.merchant}
                    size="h-9 w-9"
                    className="rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {charge.merchant}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {charge.date}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    €{charge.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
