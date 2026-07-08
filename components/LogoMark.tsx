'use client';

/**
 * Inline SVG logo for the header. Uses the site's Inter font
 * since it's rendered as part of the DOM (not as an external <img>).
 * Color is controlled via className for light/dark contexts.
 */
export default function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      width="120"
      height="38"
      viewBox="0 0 120 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Margen de Error"
    >
      <text
        x="0"
        y="14"
        fontFamily="var(--font-sans), 'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="15"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        MARGEN
      </text>
      <text
        x="0"
        y="32"
        fontFamily="var(--font-sans), 'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="15"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        DE ERROR
      </text>
      {/* Interference lines */}
      <line x1="0" y1="18.5" x2="55" y2="18.5" stroke="currentColor" strokeWidth="1" />
      <line x1="58" y1="20" x2="92" y2="20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
