/**
 * Resets all demo localStorage data back to seed defaults.
 */
export function resetDemoData(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("demo:"));
  for (const key of keys) {
    localStorage.removeItem(key);
  }
  window.location.reload();
}
