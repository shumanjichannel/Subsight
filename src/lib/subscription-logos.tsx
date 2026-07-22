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
// Custom inline SVG brand icons
// These brands are NOT available in react-icons@5.7.0 or simple-icons@16.x
// (removed due to trademark restrictions). Each is a minimal, recognizable
// SVG with a 24×24 viewBox and currentColor fill for theme support.
// ---------------------------------------------------------------------------

/** OpenAI hexagonal flower mark */
function OpenAIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 4.5h3v3h-3v-3zm-4.5 0h3v3H6v-3zm9 0h3v3h-3v-3zm-9 4.5h3v3H6v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3z" />
    </svg>
  );
}

/** Adobe stylized "A" */
function AdobeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L2 22h6.5l2.2-5.7h2.6L15.5 22H22L12 2zm-1.1 11.3L12 9.2l1.1 4.1h-2.2z" />
    </svg>
  );
}

/** AWS smile arc (Amazon Web Services) */
function AWSIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C7.03 2 3 6.03 3 11v2c0 1.1.9 2 2 2h2v-2H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-2v2h2c1.1 0 2-.9 2-2v-2c0-4.97-4.03-9-9-9zm-3 9c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h.5l-1 2h2l1-2H15l1 2h2l-1-2h.5c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2H9zm0 2h6v6H9v-6z" />
    </svg>
  );
}

/** Amazon smile/arrow */
function AmazonIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M2 17.5c.83-.11 1.66-.17 2.5-.17 2.56 0 4.85.84 6.76 2.17l.24.18.23-.19C13.65 18.17 15.94 17.33 18.5 17.33c.84 0 1.67.06 2.5.17v-2.16c-.83-.1-1.65-.17-2.5-.17-2.7 0-5.17.9-7.5 2.33-2.33-1.42-4.8-2.33-7.5-2.33-.85 0-1.67.07-2.5.17v2.16zM2 12.5c.83-.1 1.66-.17 2.5-.17 2.56 0 4.85.84 6.76 2.17l.24.18.23-.19C13.65 13.17 15.94 12.33 18.5 12.33c.84 0 1.67.06 2.5.17v-2.16c-.83-.1-1.65-.17-2.5-.17-2.7 0-5.17.9-7.5 2.33-2.33-1.42-4.8-2.33-7.5-2.33-.85 0-1.67.07-2.5.17v2.16zm1-7c-1.1 0-2 .9-2 2v1l6.5 2.5L14 8l6.5-2.5V7.5c0-1.1-.9-2-2-2H3z" />
    </svg>
  );
}

/** Bloomberg stylized "B" */
function BloombergIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="3" y="3" width="3" height="18" rx="0.5" />
      <path d="M9 3h6c3.31 0 6 2.69 6 6s-2.69 6-6 6H9v-3h6c1.66 0 3-1.34 3-3s-1.34-3-3-3H9V3zm0 9v6h5c2.21 0 4-1.79 4-4s-1.79-4-4-4H9v2z" />
    </svg>
  );
}

/** Midjourney sail/boat icon */
function MidjourneyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 18h18v2H3v-2zm1-6l8-10 8 10H4zm8-4.5L7.5 12h9L12 7.5z" />
    </svg>
  );
}

/**
 * iCloud icon — path data from simple-icons (CC0-1.0).
 * Inlined to avoid the 3k-icon barrel import that hangs Vite builds.
 * Source: https://github.com/simple-icons/simple-icons/blob/develop/icons/icloud.svg
 */
const ICLOUD_PATH =
  "M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z";

function ICloudIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={ICLOUD_PATH} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Merchant → icon resolver
// ---------------------------------------------------------------------------

type IconComponent = (props: { className?: string }) => JSX.Element;

const merchantIconComponents: Record<string, IconComponent> = {
  // Custom inline SVGs (brands missing from react-icons)
  "chatgpt plus": OpenAIcon,
  chatgpt: OpenAIcon,
  openai: OpenAIcon,
  midjourney: MidjourneyIcon,
  "adobe creative cloud": AdobeIcon,
  adobe: AdobeIcon,
  aws: AWSIcon,
  "amazon web services": AWSIcon,
  "amazon prime": AmazonIcon,
  amazon: AmazonIcon,
  bloomberg: BloombergIcon,
  // iCloud — inlined from simple-icons
  "icloud+": ICloudIcon,
  icloud: ICloudIcon,
};

/** react-icons/si mappings for brands that exist there */
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
// Fallback brand colors
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

export function getMerchantIconComponent(
  merchant: string,
): IconComponent | undefined {
  const key = merchant.toLowerCase();
  if (merchantIconComponents[key]) return merchantIconComponents[key];
  const IconType = merchantReactIcons[key];
  if (IconType) return (p) => <IconType {...p} />;
  return undefined;
}

/** Legacy API: returns IconType from react-icons (backward compat). */
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
  const IconComp = getMerchantIconComponent(merchant);

  if (IconComp) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-xl ${size} bg-white dark:bg-white/10 ${className}`}
        title={merchant}
        aria-label={merchant}
      >
        <span className="h-[55%] w-[55%] flex items-center justify-center">
          <IconComp className="h-full w-full" />
        </span>
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
