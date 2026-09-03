import { registerSW } from "virtual:pwa-register";

let registered = false;

/**
 * Silent PWA update wiring for `registerType: "autoUpdate"`.
 *
 * Why this module must exist: `vite-plugin-pwa` docs state that without
 * importing one of its virtual modules there is no way to drive client
 * tab/window reloads — the old service worker keeps controlling the app and
 * stale shells keep importing deleted hashed chunks after a deploy.
 *
 * Silent-first behaviour:
 * - new SW version detected → activate + reload automatically, no user tap;
 * - periodic update checks (interval + tab visible again) so long-open PWA
 *   sessions pick up deploys without a manual restart;
 * - update errors are logged, never surfaced as blocking UI.
 */
export function registerPWA(): void {
  if (registered) return;
  registered = true;
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // autoUpdate already activated the fresh worker; reload silently so
      // the new shell/chunks take over without user interaction.
      updateSW(true).catch(() => {
        window.location.reload();
      });
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      const checkForUpdate = () => {
        registration.update().catch(() => {
          // Offline or transient — next interval/visibility event retries.
        });
      };
      window.setInterval(checkForUpdate, 30 * 60 * 1000);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") checkForUpdate();
      });
    },
    onRegisterError(error) {
      console.error("[pwa-register-error]", error);
    },
  });
}
