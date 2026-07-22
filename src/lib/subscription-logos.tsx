import { type IconType } from "react-icons";
import {
  SiNetflix,
  SiSpotify,
  SiYoutube,
  SiNotion,
  SiFigma,
  SiPlaystation,
  SiApple,
  SiExpressvpn,
} from "react-icons/si";

/**
 * Map merchant names to Simple Icons (react-icons/si).
 * Uses exact matching; merchants without a matching icon fall back to a
 * colored initial circle.
 *
 * Note: react-icons@5.7.0 ships a subset of Simple Icons. Brands like
 * OpenAI, Midjourney, Adobe, AWS are not yet included in this version
 * and will gracefully fall back to the letter-avatar fallback.
 */
const merchantIconMap: Record<string, IconType> = {
  netflix: SiNetflix,
  spotify: SiSpotify,
  "youtube premium": SiYoutube,
  youtube: SiYoutube,
  "notion plus": SiNotion,
  notion: SiNotion,
  "figma professional": SiFigma,
  figma: SiFigma,
  "playstation plus": SiPlaystation,
  playstation: SiPlaystation,
  "icloud+": SiApple,
  icloud: SiApple,
  apple: SiApple,
  expressvpn: SiExpressvpn,
};

/**
 * Resolve a merchant name to a Simple Icon.
 * Returns the icon component if a match is found, or undefined for fallback.
 */
export function getMerchantIcon(merchant: string): IconType | undefined {
  return merchantIconMap[merchant.toLowerCase()];
}

/**
 * Brand color palette for merchant letter fallback circles.
 * Each merchant gets a consistent color derived from its name.
 */
const brandColors = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#ec4899", // pink
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#84cc16", // lime
  "#a855f7", // violet
];

/**
 * Deterministically pick a brand color from the merchant name.
 */
function getBrandColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return brandColors[Math.abs(hash) % brandColors.length];
}

/**
 * React component: renders a brand logo icon or a colored fallback circle.
 *
 * Props:
 * - merchant: the subscription merchant name (e.g. "Netflix")
 * - className: additional CSS classes for the wrapper
 * - size: icon size (h/w in CSS units, applied to wrapper)
 */
export function SubscriptionLogo({
  merchant,
  className = "",
  size = "h-10 w-10 lg:h-11 lg:w-11",
}: {
  merchant: string;
  className?: string;
  size?: string;
}) {
  const Icon = getMerchantIcon(merchant);

  if (Icon) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-xl ${size} bg-white dark:bg-white/10 ${className}`}
        title={merchant}
        aria-label={merchant}
      >
        <Icon className="h-[60%] w-[60%]" />
      </span>
    );
  }

  // Fallback: colored circle with first letter
  const initial = merchant.charAt(0).toUpperCase();
  const bgColor = getBrandColor(merchant);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${size} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={merchant}
      aria-label={merchant}
    >
      {initial}
    </span>
  );
}
