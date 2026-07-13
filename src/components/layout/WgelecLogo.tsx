/**
 * WGELECSHOP mark — industrial hexagonal badge with lightning bolt.
 * Designed from scratch for the orange/graphite brand identity.
 *
 * variant="light"  → hex uses the graphite dark surface (for light backgrounds)
 * variant="dark"   → hex uses the orange gradient (for dark backgrounds / emails)
 */
interface WgelecLogoProps {
  size?: number;
  variant?: "light" | "dark";
}

export function WgelecLogo({ size = 28, variant = "light" }: WgelecLogoProps) {
  const uid = `wgl-${variant}`;
  const hexFill = variant === "dark" ? `url(#${uid}-orange)` : "#1A1D21";
  const boltFill = variant === "dark" ? "#1A1D21" : "#FF6B1A";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WGELECSHOP"
      role="img"
    >
      <defs>
        <linearGradient id={`${uid}-orange`} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF8533" />
          <stop offset="1" stopColor="#E55A0F" />
        </linearGradient>
      </defs>

      {/* Industrial hexagonal badge */}
      <path
        d="M20 2.2L35.6 10.9V27.1L20 35.8L4.4 27.1V10.9Z"
        fill={hexFill}
        stroke="#FFB300"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Lightning bolt — the "electric" mark */}
      <path
        d="M23.2 8.6L12.6 22.2H18.2L15.6 31.4L27.4 17.4H21.8L24.6 8.6Z"
        fill={boltFill}
        stroke={boltFill}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* Amber circuit accent dot (top-right corner of badge) */}
      <circle cx="30.4" cy="11.6" r="1.7" fill="#FFB300" />
    </svg>
  );
}
