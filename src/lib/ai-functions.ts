import { subscriptions, type SubscriptionItem } from "./subscriptions-data";
import { categoryBreakdown, upcomingCharges } from "./dashboard-data";

// ── Helpers ──────────────────────────────────────────────────────────

function activeSubs(): SubscriptionItem[] {
  return subscriptions.filter((s) => s.status === "active");
}

function formatEur(n: number): string {
  return `€${n.toFixed(2)}`;
}

// ── Public function implementations ──────────────────────────────────

export function getMonthlyTotal(): { total: number; formatted: string; count: number } {
  const subs = activeSubs();
  const total = subs.reduce((sum, s) => sum + s.monthlyAmount, 0);
  return { total, formatted: formatEur(total), count: subs.length };
}

export function getYearlyTotal(): { total: number; formatted: string } {
  const subs = activeSubs();
  const total = subs.reduce((sum, s) => sum + s.yearlyEquivalent, 0);
  return { total, formatted: formatEur(total) };
}

export function getActiveSubscriptions(): {
  count: number;
  total: number;
  formatted: string;
  subscriptions: Array<{
    merchant: string;
    monthlyAmount: number;
    yearlyEquivalent: number;
    category: string;
    renewalFrequency: string;
    nextPayment: string;
  }>;
} {
  const subs = activeSubs();
  const total = subs.reduce((sum, s) => sum + s.monthlyAmount, 0);
  return {
    count: subs.length,
    total,
    formatted: formatEur(total),
    subscriptions: subs.map((s) => ({
      merchant: s.merchant,
      monthlyAmount: s.monthlyAmount,
      yearlyEquivalent: s.yearlyEquivalent,
      category: s.category,
      renewalFrequency: s.renewalFrequency,
      nextPayment: s.nextPayment,
    })),
  };
}

export function getSpendingByCategory(): Array<{
  category: string;
  monthlyAmount: number;
  percentage: number;
  count: number;
}> {
  const subs = activeSubs();
  const total = subs.reduce((sum, s) => sum + s.monthlyAmount, 0);

  const byCat = new Map<string, { amount: number; count: number }>();
  for (const s of subs) {
    const entry = byCat.get(s.category) ?? { amount: 0, count: 0 };
    entry.amount += s.monthlyAmount;
    entry.count += 1;
    byCat.set(s.category, entry);
  }

  return Array.from(byCat.entries())
    .map(([category, data]) => ({
      category,
      monthlyAmount: Math.round(data.amount * 100) / 100,
      percentage: total > 0 ? Math.round((data.amount / total) * 1000) / 10 : 0,
      count: data.count,
    }))
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount);
}

export function getBiggestIncrease(): {
  subscriptions: Array<{
    merchant: string;
    category: string;
    current: number;
    previous: number;
    increasePercent: number;
  }>;
  summary: string;
} {
  // Using hardcoded increase detection based on the current data.
  // In production, this would compare historical snapshots.
  // For the demo, we surface known price increases from the insight data.
  const increased = [
    {
      merchant: "ChatGPT Plus",
      category: "AI",
      current: 22.99,
      previous: 18.00,
      increasePercent: 27.7,
    },
    {
      merchant: "Netflix",
      category: "Entertainment",
      current: 14.99,
      previous: 12.99,
      increasePercent: 15.4,
    },
    {
      merchant: "Adobe Creative Cloud",
      category: "Productivity",
      current: 59.99,
      previous: 54.99,
      increasePercent: 9.1,
    },
  ];

  const above10 = increased.filter((s) => s.increasePercent >= 10);

  return {
    subscriptions: above10,
    summary:
      above10.length > 0
        ? `${above10.length} subscription${above10.length > 1 ? "s" : ""} increased by ≥10%. Total additional cost: ${formatEur(above10.reduce((s, i) => s + (i.current - i.previous), 0))}/mo.`
        : "No subscriptions increased by more than 10% recently.",
  };
}

export function getUpcomingCharges(): {
  charges: Array<{ merchant: string; amount: number; date: string }>;
  total: number;
  formatted: string;
} {
  const charges = upcomingCharges.map((c) => ({
    merchant: c.merchant,
    amount: c.amount,
    date: c.date,
  }));
  const total = charges.reduce((sum, c) => sum + c.amount, 0);
  return { charges, total, formatted: formatEur(total) };
}

export function getDuplicateServices(): {
  duplicates: Array<{ category: string; services: string[]; monthlyWaste: number }>;
  totalWaste: number;
  formattedWaste: string;
  summary: string;
} {
  // Detect overlaps by category
  const subs = activeSubs();
  const byCategory = new Map<string, SubscriptionItem[]>();
  for (const s of subs) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  const duplicates: Array<{ category: string; services: string[]; monthlyWaste: number }> = [];

  // Entertainment: Spotify + YouTube Premium = music overlap
  const entertainment = byCategory.get("Entertainment") ?? [];
  const musicServices = entertainment.filter((s) =>
    ["Spotify", "YouTube Premium", "Apple Music", "Tidal"].includes(s.merchant),
  );
  if (musicServices.length >= 2) {
    const cheapest = Math.min(...musicServices.map((s) => s.monthlyAmount));
    const waste = musicServices.reduce((sum, s) => sum + s.monthlyAmount, 0) - cheapest;
    duplicates.push({
      category: "Entertainment",
      services: musicServices.map((s) => s.merchant),
      monthlyWaste: Math.round(waste * 100) / 100,
    });
  }

  // AI: multiple AI subscriptions
  const aiSubs = byCategory.get("AI") ?? [];
  if (aiSubs.length >= 2) {
    const cheapest = Math.min(...aiSubs.map((s) => s.monthlyAmount));
    const waste = aiSubs.reduce((sum, s) => sum + s.monthlyAmount, 0) - cheapest;
    duplicates.push({
      category: "AI",
      services: aiSubs.map((s) => s.merchant),
      monthlyWaste: Math.round(waste * 100) / 100,
    });
  }

  // Productivity: Notion + Figma overlap (both collaboration tools)
  const productivity = byCategory.get("Productivity") ?? [];
  const collabTools = productivity.filter((s) =>
    ["Notion Plus", "Figma Professional"].includes(s.merchant),
  );
  if (collabTools.length >= 2) {
    const cheapest = Math.min(...collabTools.map((s) => s.monthlyAmount));
    const waste = collabTools.reduce((sum, s) => sum + s.monthlyAmount, 0) - cheapest;
    duplicates.push({
      category: "Productivity",
      services: collabTools.map((s) => s.merchant),
      monthlyWaste: Math.round(waste * 100) / 100,
    });
  }

  // Utilities: iCloud+ and other storage overlap
  const utilities = byCategory.get("Utilities") ?? [];
  const storageServices = utilities.filter((s) =>
    ["iCloud+", "Google One", "Dropbox", "AWS"].includes(s.merchant),
  );
  if (storageServices.length >= 2) {
    const cheapest = Math.min(...storageServices.map((s) => s.monthlyAmount));
    const waste = storageServices.reduce((sum, s) => sum + s.monthlyAmount, 0) - cheapest;
    duplicates.push({
      category: "Utilities",
      services: storageServices.map((s) => s.merchant),
      monthlyWaste: Math.round(waste * 100) / 100,
    });
  }

  const totalWaste = duplicates.reduce((sum, d) => sum + d.monthlyWaste, 0);

  return {
    duplicates,
    totalWaste: Math.round(totalWaste * 100) / 100,
    formattedWaste: formatEur(totalWaste),
    summary:
      duplicates.length > 0
        ? `Found ${duplicates.length} overlapping service categor${duplicates.length > 1 ? "ies" : "y"}. Potential monthly savings: ${formatEur(totalWaste)}.`
        : "No duplicate services detected.",
  };
}

export function getSavingsSuggestions(): {
  suggestions: Array<{ category: string; description: string; monthlySaving: number; annualSaving: number }>;
  totalMonthlySaving: number;
  totalAnnualSaving: number;
  formattedMonthly: string;
  formattedAnnual: string;
} {
  const suggestions: Array<{
    category: string;
    description: string;
    monthlySaving: number;
    annualSaving: number;
  }> = [];

  // 1. Duplicate music services
  const dupeResult = getDuplicateServices();
  if (dupeResult.totalWaste > 0) {
    suggestions.push({
      category: "Duplicate Services",
      description: `Cancel duplicate ${dupeResult.duplicates.map((d) => d.services.join(" & ")).join("; ")} — keep only the essential one.`,
      monthlySaving: dupeResult.totalWaste,
      annualSaving: Math.round(dupeResult.totalWaste * 12 * 100) / 100,
    });
  }

  // 2. Annual billing savings (3 subscriptions: Adobe CC, ChatGPT, Bloomberg)
  const subs = activeSubs();
  const annualCandidates = subs.filter(
    (s) => s.renewalFrequency === "Monthly" && s.monthlyAmount >= 10,
  );

  // Estimate: annual billing saves ~15-17% on average
  const annualSavings = annualCandidates
    .slice(0, 3)
    .map((s) => ({
      merchant: s.merchant,
      monthly: s.monthlyAmount,
      // Monthly * 12 vs typical annual discount (~2 months free)
      saving: Math.round(s.monthlyAmount * 2 * 100) / 100,
    }));

  if (annualSavings.length > 0) {
    const totalAnnualSave = annualSavings.reduce((sum, s) => sum + s.saving, 0);
    suggestions.push({
      category: "Annual Billing",
      description: `Switch ${annualSavings.map((a) => a.merchant).join(", ")} to annual billing. Save ~2 months' worth on each.`,
      monthlySaving: Math.round((totalAnnualSave / 12) * 100) / 100,
      annualSaving: Math.round(totalAnnualSave * 100) / 100,
    });
  }

  // 3. Cancel paused/cancelled but still paying
  const nonActive = subscriptions.filter((s) => s.status !== "active" && s.status !== "unknown");
  const nonActiveStillBilling = nonActive.filter((s) => s.monthlyAmount > 0);
  if (nonActiveStillBilling.length > 0) {
    const waste = nonActiveStillBilling.reduce((sum, s) => sum + s.monthlyAmount, 0);
    suggestions.push({
      category: "Unused Subscriptions",
      description: `Review paused/cancelled subscriptions: ${nonActiveStillBilling.map((s) => s.merchant).join(", ")}. Ensure billing is stopped.`,
      monthlySaving: Math.round(waste * 100) / 100,
      annualSaving: Math.round(waste * 12 * 100) / 100,
    });
  }

  const totalMonthlySaving = suggestions.reduce((sum, s) => sum + s.monthlySaving, 0);
  const totalAnnualSaving = suggestions.reduce((sum, s) => sum + s.annualSaving, 0);

  return {
    suggestions,
    totalMonthlySaving: Math.round(totalMonthlySaving * 100) / 100,
    totalAnnualSaving: Math.round(totalAnnualSaving * 100) / 100,
    formattedMonthly: formatEur(totalMonthlySaving),
    formattedAnnual: formatEur(totalAnnualSaving),
  };
}

// ── Registry of all available functions ─────────────────────────────

export interface AiFunctionResult {
  name: string;
  result: unknown;
}

export function callFunction(name: string): unknown {
  switch (name) {
    case "getMonthlyTotal":
      return getMonthlyTotal();
    case "getYearlyTotal":
      return getYearlyTotal();
    case "getActiveSubscriptions":
      return getActiveSubscriptions();
    case "getSpendingByCategory":
      return getSpendingByCategory();
    case "getBiggestIncrease":
      return getBiggestIncrease();
    case "getUpcomingCharges":
      return getUpcomingCharges();
    case "getDuplicateServices":
      return getDuplicateServices();
    case "getSavingsSuggestions":
      return getSavingsSuggestions();
    default:
      return { error: `Unknown function: ${name}` };
  }
}
