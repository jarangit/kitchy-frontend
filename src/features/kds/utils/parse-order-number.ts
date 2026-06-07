/**
 * Extract the numeric suffix of an order number so columns can be
 * sorted numerically instead of lexicographically.
 *
 *   parseOrderNumberSuffix("KTO-5115")  → 5115
 *   parseOrderNumberSuffix("KTO-999")   → 999
 *   parseOrderNumberSuffix("KTO-1000")  → 1000
 *   parseOrderNumberSuffix("abc")       → 0  (fallback: keep grouping stable)
 */
export const parseOrderNumberSuffix = (orderNumber: string): number => {
  const idx = orderNumber.lastIndexOf("-");
  const tail = idx >= 0 ? orderNumber.slice(idx + 1) : orderNumber;
  const n = Number.parseInt(tail, 10);
  return Number.isFinite(n) ? n : 0;
};

export const compareOrderNumber = (a: string, b: string): number =>
  parseOrderNumberSuffix(a) - parseOrderNumberSuffix(b);
