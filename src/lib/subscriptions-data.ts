export type SubscriptionStatus = "active" | "paused" | "cancelled" | "unknown";
export type SubscriptionCategory =
  | "Entertainment"
  | "Productivity"
  | "AI"
  | "Gaming"
  | "Utilities"
  | "Finance"
  | "Shopping"
  | "Other";
export type PaymentMethod = "Visa ····4242" | "Mastercard ····8891" | "PayPal" | "Direct Debit" | "Apple Pay";
export type RenewalFrequency = "Monthly" | "Yearly" | "Quarterly";

export interface SubscriptionItem {
  id: number;
  merchant: string;
  logo: string;
  monthlyAmount: number;
  yearlyEquivalent: number;
  lastPayment: string;
  nextPayment: string;
  category: SubscriptionCategory;
  paymentMethod: PaymentMethod;
  renewalFrequency: RenewalFrequency;
  status: SubscriptionStatus;
}

export interface DetectedSubscription {
  id: number;
  merchant: string;
  logo: string;
  monthlyAmount: number;
  confidence: number;
  category: SubscriptionCategory;
}

export const categories: SubscriptionCategory[] = [
  "Entertainment",
  "Productivity",
  "AI",
  "Gaming",
  "Utilities",
  "Finance",
  "Shopping",
  "Other",
];

export const categoryColors: Record<SubscriptionCategory, string> = {
  Entertainment: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  Productivity: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  AI: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400",
  Gaming: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Utilities: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Finance: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  Shopping: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export const categoryAvatarColors: Record<SubscriptionCategory, string> = {
  Entertainment: "bg-purple-500",
  Productivity: "bg-blue-500",
  AI: "bg-cyan-500",
  Gaming: "bg-amber-500",
  Utilities: "bg-emerald-500",
  Finance: "bg-red-500",
  Shopping: "bg-pink-500",
  Other: "bg-gray-500",
};

export const subscriptions: SubscriptionItem[] = [
  {
    id: 1,
    merchant: "Netflix",
    logo: "🎬",
    monthlyAmount: 14.99,
    yearlyEquivalent: 179.88,
    lastPayment: "Jun 28, 2026",
    nextPayment: "Jul 28, 2026",
    category: "Entertainment",
    paymentMethod: "Visa ····4242",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 2,
    merchant: "Spotify",
    logo: "🎵",
    monthlyAmount: 10.99,
    yearlyEquivalent: 131.88,
    lastPayment: "Jun 22, 2026",
    nextPayment: "Jul 22, 2026",
    category: "Entertainment",
    paymentMethod: "Mastercard ····8891",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 3,
    merchant: "YouTube Premium",
    logo: "▶️",
    monthlyAmount: 13.99,
    yearlyEquivalent: 167.88,
    lastPayment: "Jun 15, 2026",
    nextPayment: "Jul 15, 2026",
    category: "Entertainment",
    paymentMethod: "PayPal",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 4,
    merchant: "ChatGPT Plus",
    logo: "🤖",
    monthlyAmount: 22.99,
    yearlyEquivalent: 275.88,
    lastPayment: "Jul 1, 2026",
    nextPayment: "Aug 1, 2026",
    category: "AI",
    paymentMethod: "Visa ····4242",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 5,
    merchant: "Midjourney",
    logo: "🖼️",
    monthlyAmount: 10.00,
    yearlyEquivalent: 96.00,
    lastPayment: "Jun 18, 2026",
    nextPayment: "Jul 18, 2026",
    category: "AI",
    paymentMethod: "Mastercard ····8891",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 6,
    merchant: "Adobe Creative Cloud",
    logo: "🎨",
    monthlyAmount: 59.99,
    yearlyEquivalent: 719.88,
    lastPayment: "Jul 5, 2026",
    nextPayment: "Aug 5, 2026",
    category: "Productivity",
    paymentMethod: "Visa ····4242",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 7,
    merchant: "Notion Plus",
    logo: "📝",
    monthlyAmount: 9.99,
    yearlyEquivalent: 119.88,
    lastPayment: "Jul 3, 2026",
    nextPayment: "Aug 3, 2026",
    category: "Productivity",
    paymentMethod: "Apple Pay",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 8,
    merchant: "Figma Professional",
    logo: "🎯",
    monthlyAmount: 15.00,
    yearlyEquivalent: 180.00,
    lastPayment: "May 10, 2026",
    nextPayment: "—",
    category: "Productivity",
    paymentMethod: "PayPal",
    renewalFrequency: "Monthly",
    status: "paused",
  },
  {
    id: 9,
    merchant: "PlayStation Plus",
    logo: "🎮",
    monthlyAmount: 13.99,
    yearlyEquivalent: 167.88,
    lastPayment: "Apr 15, 2026",
    nextPayment: "—",
    category: "Gaming",
    paymentMethod: "Visa ····4242",
    renewalFrequency: "Monthly",
    status: "cancelled",
  },
  {
    id: 10,
    merchant: "AWS",
    logo: "☁️",
    monthlyAmount: 17.55,
    yearlyEquivalent: 210.60,
    lastPayment: "Jul 5, 2026",
    nextPayment: "Aug 5, 2026",
    category: "Utilities",
    paymentMethod: "Visa ····4242",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 11,
    merchant: "iCloud+",
    logo: "🍎",
    monthlyAmount: 2.99,
    yearlyEquivalent: 35.88,
    lastPayment: "Jul 1, 2026",
    nextPayment: "Aug 1, 2026",
    category: "Utilities",
    paymentMethod: "Apple Pay",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 12,
    merchant: "Bloomberg",
    logo: "📊",
    monthlyAmount: 34.99,
    yearlyEquivalent: 419.88,
    lastPayment: "Jun 20, 2026",
    nextPayment: "Jul 20, 2026",
    category: "Finance",
    paymentMethod: "Direct Debit",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 13,
    merchant: "Amazon Prime",
    logo: "📦",
    monthlyAmount: 8.99,
    yearlyEquivalent: 107.88,
    lastPayment: "Jun 10, 2026",
    nextPayment: "Jul 10, 2026",
    category: "Shopping",
    paymentMethod: "Mastercard ····8891",
    renewalFrequency: "Monthly",
    status: "active",
  },
  {
    id: 14,
    merchant: "ExpressVPN",
    logo: "🔒",
    monthlyAmount: 12.95,
    yearlyEquivalent: 99.95,
    lastPayment: "Feb 1, 2026",
    nextPayment: "—",
    category: "Utilities",
    paymentMethod: "PayPal",
    renewalFrequency: "Yearly",
    status: "unknown",
  },
];

export const detectedSubscriptions: DetectedSubscription[] = [
  {
    id: 101,
    merchant: "Netflix",
    logo: "🎬",
    monthlyAmount: 14.99,
    confidence: 98,
    category: "Entertainment",
  },
  {
    id: 102,
    merchant: "Spotify",
    logo: "🎵",
    monthlyAmount: 10.99,
    confidence: 95,
    category: "Entertainment",
  },
  {
    id: 103,
    merchant: "Adobe Creative Cloud",
    logo: "🎨",
    monthlyAmount: 59.99,
    confidence: 88,
    category: "Productivity",
  },
];

export type SortOption = "amount-desc" | "amount-asc" | "next-payment" | "name";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "amount-desc", label: "Amount: High → Low" },
  { value: "amount-asc", label: "Amount: Low → High" },
  { value: "next-payment", label: "Next Payment Date" },
  { value: "name", label: "Merchant Name" },
];
