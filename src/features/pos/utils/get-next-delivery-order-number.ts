interface DeliveryOrderLike {
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
}

/**
 * Derives the suggested "next" delivery app order number for a platform by
 * incrementing the numeric suffix of the most recent delivery order that was
 * placed through that platform. Preserves the full prefix before the last `-`.
 *
 * Returns `null` when there is no prior delivery order for the platform (the
 * prefix is unknown) or when no numeric suffix can be parsed.
 */
export function getNextDeliveryOrderNumber(
  orders: DeliveryOrderLike[] | undefined,
  platform: string,
): string | null {
  const platformKey = platform.trim().toLowerCase();
  if (!platformKey) return null;

  let maxSuffix = 0;
  let prefix = "";

  for (const order of orders ?? []) {
    if (order.deliveryPlatform?.trim().toLowerCase() !== platformKey) continue;

    const raw = order.deliveryOrderNumber?.trim();
    if (!raw) continue;

    const idx = raw.lastIndexOf("-");
    const suffixRaw = idx >= 0 ? raw.slice(idx + 1) : raw;
    if (!/^\d+$/.test(suffixRaw)) continue;

    const suffix = Number(suffixRaw);
    if (!Number.isFinite(suffix)) continue;

    if (suffix > maxSuffix) {
      maxSuffix = suffix;
      prefix = idx >= 0 ? raw.slice(0, idx + 1) : "";
    }
  }

  if (maxSuffix === 0) return null;

  return `${prefix}${maxSuffix + 1}`;
}
