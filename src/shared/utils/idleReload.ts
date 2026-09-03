// utils/idleReload.ts
const ACTIVITY_EVENTS = [
  "mousemove",
  "keydown",
  "click",
  "scroll",
  "touchstart",
] as const;

let refCount = 0;
let intervalId: number | undefined;
let lastActivity = 0;
let activeMinutes = 10;

function markActivity() {
  lastActivity = Date.now();
}

function ensureInstalled() {
  if (intervalId !== undefined) return;
  lastActivity = Date.now();
  ACTIVITY_EVENTS.forEach((event) =>
    window.addEventListener(event, markActivity, { passive: true }),
  );
  intervalId = window.setInterval(() => {
    if (Date.now() - lastActivity > activeMinutes * 60 * 1000) {
      window.location.reload();
    }
  }, 30 * 1000);
}

function teardownIfUnused() {
  if (refCount > 0 || intervalId === undefined) return;
  window.clearInterval(intervalId);
  intervalId = undefined;
  ACTIVITY_EVENTS.forEach((event) =>
    window.removeEventListener(event, markActivity),
  );
}

/**
 * Registers the idle auto-reload handler. Reference-counted so multiple
 * mounted shells (Layout + SettingsFrame across navigations, StrictMode
 * double-mount) share one timer, and unmounting cleans up instead of
 * accumulating intervals/listeners. Returns a cleanup for `useEffect`.
 */
export function setupAutoReload(minutes = 10) {
  activeMinutes = minutes;
  refCount += 1;
  ensureInstalled();

  let cleanedUp = false;
  return () => {
    if (cleanedUp) return;
    cleanedUp = true;
    refCount = Math.max(0, refCount - 1);
    teardownIfUnused();
  };
}
