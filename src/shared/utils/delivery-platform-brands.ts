/**
 * Brand colors for known delivery platforms.
 *
 * These are third-party brand assets (like the Google sign-in logo colors),
 * so they intentionally bypass the design-token system and are rendered via
 * inline `style` rather than Tailwind arbitrary classes (which JIT cannot
 * generate for dynamic hex values at runtime).
 */

export interface DeliveryPlatformBrand {
  /** Primary brand color used as the solid card background. */
  brandColor: string;
  /** Foreground color to render text on top of `brandColor`. */
  onColor: string;
}

export const DELIVERY_PLATFORM_BRANDS: Readonly<
  Record<string, DeliveryPlatformBrand>
> = {
  "line man": { brandColor: "#00C853", onColor: "#FFFFFF" },
  grabfood: { brandColor: "#00B14F", onColor: "#FFFFFF" },
  shopeefood: { brandColor: "#EE4D2D", onColor: "#FFFFFF" },
  robinhood: { brandColor: "#5B2C83", onColor: "#FFFFFF" },
  foodpanda: { brandColor: "#D70F64", onColor: "#FFFFFF" },
};

/**
 * Resolves the brand for a platform name (case-insensitive). Returns `null`
 * for unknown/custom platforms (e.g. "อื่นๆ", "Other") so callers can keep
 * the neutral default styling.
 */
export const getDeliveryPlatformBrand = (
  name: string,
): DeliveryPlatformBrand | null =>
  DELIVERY_PLATFORM_BRANDS[name.trim().toLowerCase()] ?? null;
