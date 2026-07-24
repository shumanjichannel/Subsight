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

// ---------------------------------------------------------------------------
// Official brand SVGs from simple-icons (via jsDelivr CDN)
// These are the real, official brand SVG icons — not custom art.
// ---------------------------------------------------------------------------

/** CDN URLs for official brand SVGs available in simple-icons@13 */
const CdnLogos: Record<string, string> = {
  openai: "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/openai.svg",
  adobe: "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/adobe.svg",
  aws: "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/amazonwebservices.svg",
  amazon: "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/amazon.svg",
  icloud: "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/icloud.svg",
};

/** Merchant name → simple-icons CDN key (lowercase, nominal form). */
const merchantCdnKeys: Record<string, string> = {
  "chatgpt plus": "openai",
  chatgpt: "openai",
  "adobe creative cloud": "adobe",
  aws: "aws",
  "amazon web services": "aws",
  "amazon prime": "amazon",
  "icloud+": "icloud",
};

// ---------------------------------------------------------------------------
// react-icons/si mappings — keep exactly as-is
// ---------------------------------------------------------------------------

const merchantReactIcons: Record<string, IconType> = {
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
  apple: SiApple,
  expressvpn: SiExpressvpn,
};

// ---------------------------------------------------------------------------
// Fallback brand colors (for Bloomberg, Midjourney, and any unmatched brand)
// ---------------------------------------------------------------------------

const brandColors = [
  "#8b5cf6", "#3b82f6", "#06b6d4", "#f59e0b",
  "#10b981", "#ef4444", "#ec4899", "#f97316",
  "#6366f1", "#14b8a6", "#84cc16", "#a855f7",
];

function getBrandColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return brandColors[Math.abs(hash) % brandColors.length];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getMerchantIcon(merchant: string): IconType | undefined {
  return merchantReactIcons[merchant.toLowerCase()];
}

/** Main component: renders a brand logo icon or colored-circle fallback. */
export function SubscriptionLogo({
  merchant,
  className = "",
  size = "h-10 w-10 lg:h-11 lg:w-11",
}: {
  merchant: string;
  className?: string;
  size?: string;
}) {
  const key = merchant.toLowerCase();

  // 1. Official CDN SVGs (OpenAI, Adobe, AWS, Amazon, iCloud)
  const cdnKey = merchantCdnKeys[key];
  if (cdnKey) {
    const src = CdnLogos[cdnKey];
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-xl ${size} bg-white dark:bg-white/10 ${className}`}
        title={merchant}
        aria-label={merchant}
      >
        <img
          src={src}
          alt={merchant}
          className="h-[55%] w-[55%] object-contain"
          // Use the merchant name as a loading hint; the CDN is stable
          loading="lazy"
        />
      </span>
    );
  }

  // 2. react-icons/si mappings (Netflix, Spotify, YouTube, Notion, Figma, etc.)
  const IconType = merchantReactIcons[key];
  if (IconType) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-xl ${size} bg-white dark:bg-white/10 ${className}`}
        title={merchant}
        aria-label={merchant}
      >
        <span className="h-[55%] w-[55%] flex items-center justify-center">
          <IconType className="h-full w-full" />
        </span>
      </span>
    );
  }

  // 3. Fallback: colored circle with first letter
  //    (Bloomberg, Midjourney, and any future unmatched brands)
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
