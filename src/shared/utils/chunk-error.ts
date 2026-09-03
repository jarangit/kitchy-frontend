/**
 * Detection + single-reload guard for stale lazy-chunk failures.
 *
 * Context: the app lazy-loads nearly every route (`src/app/App.tsx`) and runs
 * as an installed PWA (`registerType: "autoUpdate"`). After a deploy, an old
 * shell can try to `import()` a hashed chunk that no longer exists, which
 * rejects with a ChunkLoadError / "Failed to fetch dynamically imported
 * module". Without handling, that rejection unmounts the tree → blank screen
 * with no reload affordance on standalone PWA.
 *
 * Strategy (silent-first):
 * - first chunk failure in this tab → reload once automatically;
 * - further failures in the same session → surface recovery UI instead of
 *   looping reloads.
 */

const RELOAD_FLAG = "kitchy-chunk-reload-v1";

const CHUNK_MESSAGE_PATTERNS = [
  "Failed to fetch dynamically imported module",
  "Loading chunk",
  "ChunkLoadError",
  "Importing a module script failed",
  "error loading dynamically imported module",
];

export function isChunkLoadError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: unknown; message?: unknown };
  if (typeof err.name === "string" && err.name === "ChunkLoadError") {
    return true;
  }
  if (typeof err.message !== "string") return false;
  const message = err.message;
  return CHUNK_MESSAGE_PATTERNS.some((pattern) => message.includes(pattern));
}

function storageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && !!window.sessionStorage;
  } catch {
    return false;
  }
}

/**
 * Returns true when the caller should perform the one silent reload for this
 * session. The flag persists across the reload (sessionStorage) so a second
 * consecutive chunk failure will NOT trigger another automatic reload —
 * the error boundary then shows recovery UI instead of looping.
 */
export function claimChunkReload(): boolean {
  if (!storageAvailable()) return true;
  try {
    if (window.sessionStorage.getItem(RELOAD_FLAG) === "1") return false;
    window.sessionStorage.setItem(RELOAD_FLAG, "1");
    return true;
  } catch {
    return true;
  }
}

export function clearChunkReloadClaim(): void {
  if (!storageAvailable()) return;
  try {
    window.sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    // ignore — storage may be blocked in some PWA contexts
  }
}

/**
 * Silent recovery entry point: reload once per session when `error` looks
 * like a stale-chunk failure. Returns true when a reload was triggered.
 */
export function recoverFromChunkError(error: unknown): boolean {
  if (!isChunkLoadError(error)) return false;
  if (!claimChunkReload()) return false;
  window.location.reload();
  return true;
}

/**
 * Global safety net for chunk failures that reject outside React render
 * (e.g. dynamic `import()` in event handlers or router transitions).
 * Installed once from `src/app/main.tsx`. Returns a cleanup function.
 */
export function installChunkRecoveryListeners(): () => void {
  const onError = (event: ErrorEvent) => {
    if (isChunkLoadError(event.error ?? event.message)) {
      recoverFromChunkError(event.error ?? new Error(String(event.message)));
    }
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    if (isChunkLoadError(event.reason)) {
      recoverFromChunkError(event.reason);
    }
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
