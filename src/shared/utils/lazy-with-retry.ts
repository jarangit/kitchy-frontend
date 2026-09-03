import { lazy, type ComponentType } from "react";
import { isChunkLoadError, recoverFromChunkError } from "./chunk-error";

/**
 * Drop-in replacement for `React.lazy` used by route-level code splitting.
 *
 * Behaviour:
 * - first attempt fails with a transient error → retry the import once
 *   (covers flaky network on PWA devices);
 * - failure looks like a stale-chunk/deploy mismatch → trigger the silent
 *   one-per-session reload and keep Suspense pending while the new shell
 *   loads (no blank screen, no user tap needed);
 * - anything else → rethrow so the global error boundary can handle it.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    importFn().catch((firstError: unknown) => {
      if (isChunkLoadError(firstError)) {
        if (recoverFromChunkError(firstError)) {
          // Never resolve: stay on the Suspense fallback while the fresh
          // document loads instead of flashing a blank/error screen.
          return new Promise<{ default: T }>(() => {});
        }
        throw firstError;
      }
      // Transient failure (offline blip etc.): one retry, then real error.
      return importFn().catch((secondError: unknown) => {
        if (isChunkLoadError(secondError)) {
          if (recoverFromChunkError(secondError)) {
            return new Promise<{ default: T }>(() => {});
          }
        }
        throw secondError;
      });
    }),
  );
}
