import { DEMO_STORE_PRESET_STORAGE_KEY } from "./seed-data";

/**
 * Resets all demo localStorage data back to seed defaults.
 */
export function clearDemoData(): void {
  const keys = Object.keys(localStorage).filter(
    (k) => k.startsWith("demo:") && k !== DEMO_STORE_PRESET_STORAGE_KEY,
  );
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

export function resetDemoData(): void {
  clearDemoData();
  window.location.reload();
}
