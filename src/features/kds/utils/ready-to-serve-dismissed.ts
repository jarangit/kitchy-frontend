const dismissedKey = (storeId?: string | null) =>
  `kitchy.readyToServe.dismissed.${storeId ?? "global"}`;

export const readReadyToServeDismissed = (storeId?: string | null) => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = localStorage.getItem(dismissedKey(storeId));
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(ids);
  } catch {
    return new Set<string>();
  }
};

export const writeReadyToServeDismissed = (
  storeId: string | null | undefined,
  ids: Set<string>
) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(dismissedKey(storeId), JSON.stringify(Array.from(ids)));
};
