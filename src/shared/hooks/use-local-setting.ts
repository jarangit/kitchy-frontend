import { useCallback, useEffect, useState } from "react";

/**
 * Lightweight local-only setting persisted to localStorage.
 * Used by the Settings Control Panel as a placeholder while real
 * backend-backed settings are not wired up yet. Tap → change → done.
 */
export function useLocalSetting<T>(key: string, initial: T) {
  const storageKey = `kitchy.setting.${key}`;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw === null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
  }, [storageKey, value]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof next === "function" ? (next as (p: T) => T)(prev) : next
    );
  }, []);

  return [value, update] as const;
}
