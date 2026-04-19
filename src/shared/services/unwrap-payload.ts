/**
 * Unwraps the Axios + API response envelope to the raw array payload.
 *
 * Backend endpoints may return:
 *  - the array directly,
 *  - `{ data: T[] }`, or
 *  - `{ data: { data: T[] } }` (nested envelope used by some services).
 *
 * This helper normalises all three shapes so callers can rely on a plain
 * array. Previously duplicated byte-identical in `useKds.ts` and
 * `use-pending-orders-count.ts`; consolidate here so the cache key shape
 * contract stays in a single spot.
 */
export const unwrapPayload = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data as T[];
    }
  }

  return [];
};
