export interface StatCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface Subscription {
  id: number;
  merchant: string;
  logo: string;
  amount: number;
  nextPayment: string;
  category: string;
  status: "active" | "paused" | "cancelled";
}

export interface Insight {
  icon: string;
  title: string;
  description: string;
}

export interface UpcomingCharge {
  merchant: string;
  logo: string;
  amount: number;
  date: string;
}

export const stats: StatCard[] = [
  {
    label: "Monthly Total",
    value: "€186.42",
    trend: "8.3%",
    trendUp: true,
    icon: "Calendar",
  },
  {
    label: "Yearly Total",
    value: "€2,237.04",
    trend: "12.1%",
    trendUp: true,
    icon: "BarChart3",
  },
  {
    label: "Active Subscriptions",
    value: "14",
    trend: "2",
    trendUp: true,
    icon: "Layers",
  },
  {
    label: "Upcoming This Month",
    value: "4 charges / €87.50",
    trend: "16.7%",
    trendUp: false,
    icon: "Clock",
  },
];

export const monthlySpending: MonthlySpending[] = [
  { month: "Aug", amount: 145 },
  { month: "Sep", amount: 152 },
  { month: "Oct", amount: 148 },
  { month: "Nov", amount: 167 },
  { month: "Dec", amount: 159 },
  { month: "Jan", amount: 172 },
  { month: "Feb", amount: 186 },
  { month: "Mar", amount: 178 },
  { month: "Apr", amount: 192 },
  { month: "May", amount: 181 },
  { month: "Jun", amount: 195 },
  { month: "Jul", amount: 186 },
];

export const categoryBreakdown: CategoryBreakdown[] = [
  { name: "Entertainment", value: 42, color: "#8b5cf6" },
  { name: "Productivity", value: 35, color: "#3b82f6" },
  { name: "AI", value: 28, color: "#06b6d4" },
  { name: "Gaming", value: 18, color: "#f59e0b" },
  { name: "Utilities", value: 22, color: "#10b981" },
  { name: "Finance", value: 15, color: "#ef4444" },
  { name: "Shopping", value: 16, color: "#ec4899" },
  { name: "Other", value: 10, color: "#6b7280" },
];

export const recentSubscriptions: Subscription[] = [
  {
    id: 1,
    merchant: "Netflix",
    logo: "🎬",
    amount: 14.99,
    nextPayment: "Jul 28, 2026",
    category: "Entertainment",
    status: "active",
  },
  {
    id: 2,
    merchant: "ChatGPT Plus",
    logo: "🤖",
    amount: 22.99,
    nextPayment: "Jul 25, 2026",
    category: "AI",
    status: "active",
  },
  {
    id: 3,
    merchant: "Spotify",
    logo: "🎵",
    amount: 10.99,
    nextPayment: "Jul 22, 2026",
    category: "Entertainment",
    status: "active",
  },
  {
    id: 4,
    merchant: "Adobe Creative Cloud",
    logo: "🎨",
    amount: 59.99,
    nextPayment: "Aug 1, 2026",
    category: "Productivity",
    status: "active",
  },
  {
    id: 5,
    merchant: "Notion Plus",
    logo: "📝",
    amount: 9.99,
    nextPayment: "Aug 3, 2026",
    category: "Productivity",
    status: "active",
  },
];

export const insights: Insight[] = [
  {
    icon: "AlertTriangle",
    title: "Duplicate music subscriptions",
    description:
      "You could save €31/mo by cancelling duplicate music subscriptions. You have both Spotify and YouTube Music.",
  },
  {
    icon: "TrendingUp",
    title: "AI spend increasing",
    description:
      "AI subscriptions increased 24% over last month. ChatGPT Plus and Midjourney are your top AI expenses.",
  },
  {
    icon: "Clock",
    title: "Annual billing opportunity",
    description:
      "Switching 3 subscriptions to annual billing could save you €82/year. Adobe CC alone saves €60.",
  },
];

export const upcomingCharges: UpcomingCharge[] = [
  {
    merchant: "Adobe Creative Cloud",
    logo: "🎨",
    amount: 59.99,
    date: "Aug 1, 2026",
  },
  {
    merchant: "Notion Plus",
    logo: "📝",
    amount: 9.99,
    date: "Aug 3, 2026",
  },
  {
    merchant: "AWS",
    logo: "☁️",
    amount: 17.55,
    date: "Aug 5, 2026",
  },
];
