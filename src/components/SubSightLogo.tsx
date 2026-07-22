import { cn } from "~/lib/utils";

interface SubSightLogoProps {
  /** Render only the mark (icon) without the wordmark */
  iconOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Height in pixels for the mark */
  size?: number;
}

/**
 * SubSight brand logo: a lens/eye mark + "SubSight" wordmark.
 * Works in dark and light mode via currentColor and CSS variables.
 * Stripe/Linear-inspired minimal aesthetic.
 */
export default function SubSightLogo({
  iconOnly = false,
  className,
  size = 28,
}: SubSightLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}
    >
      {/* Mark: an eye with a lens — the pupil is a magnifying glass */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Outer eye shape */}
        <path
          d="M16 8C8.268 8 2 16 2 16s6.268 8 14 8 14-8 14-8-6.268-8-14-8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Iris ring */}
        <circle
          cx="16"
          cy="16"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Pupil / lens highlight */}
        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        {/* Magnifying glass handle — extends from the eye */}
        <path
          d="M24 24l6.5 6.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Lens gleam */}
        <path
          d="M13 14a3 3 0 0 1 1.5-2.6"
          fill="none"
          stroke="color-mix(in srgb, currentColor 40%, transparent)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {!iconOnly && (
        <span className="select-none text-lg leading-none">SubSight</span>
      )}
    </span>
  );
}
