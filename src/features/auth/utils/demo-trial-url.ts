/**
 * External demo-trial URL, configured later via the `VITE_DEMO_TRIAL_URL`
 * build-time env var (e.g. `https://demo.kitchy.app/try`).
 *
 * Returns the trimmed URL, or `null` when unset/blank — callers hide the
 * trial button in that case instead of falling back anywhere.
 */
export function getDemoTrialUrl(): string | null {
  const raw = import.meta.env.VITE_DEMO_TRIAL_URL as string | undefined;
  const url = raw?.trim();
  return url ? url : null;
}
