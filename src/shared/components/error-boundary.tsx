import { Component, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslation } from "@/shared/i18n/use-translation";
import {
  isChunkLoadError,
  recoverFromChunkError,
} from "@/shared/utils/chunk-error";

interface Props {
  children: ReactNode;
}

interface State {
  error: unknown | null;
  isChunkError: boolean;
  autoRecovering: boolean;
}

/**
 * Global render safety net mounted in `src/app/main.tsx` above the router.
 *
 * - Stale-chunk failures (old PWA shell + new deploy) → silent reload once
 *   per session; while reloading, show an "updating" state instead of white.
 * - Repeat failures (reload already claimed) → recovery screen with a manual
 *   reload button, so standalone PWA users always have a way out.
 * - Any other render error → generic error screen with retry (remount).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, isChunkError: false, autoRecovering: false };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error: unknown) {
    // Keep for production diagnosis (Sentry/Clarity can pick up console).
    console.error("[app-error-boundary]", error);
    if (isChunkLoadError(error)) {
      const reloaded = recoverFromChunkError(error);
      if (reloaded) {
        this.setState({ autoRecovering: true });
      }
    }
  }

  private handleRetry = () => {
    this.setState({ error: null, isChunkError: false, autoRecovering: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      if (this.state.isChunkError && this.state.autoRecovering) {
        return <UpdatingFallback />;
      }
      return (
        <ErrorFallback
          isChunkError={this.state.isChunkError}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }
    return this.props.children;
  }
}

function UpdatingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3 text-text-secondary">
        <Spinner size="lg" label={t("app.recovery.updating")} />
        <p className="text-body font-medium">{t("app.recovery.updating")}</p>
      </div>
    </div>
  );
}

function ErrorFallback({
  isChunkError,
  onRetry,
  onReload,
}: {
  isChunkError: boolean;
  onRetry: () => void;
  onReload: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-card border border-card-border bg-card-bg p-6 text-center shadow-sm">
        <h1 className="text-title font-semibold text-text-primary">
          {isChunkError
            ? t("app.recovery.updateTitle")
            : t("common.error.title")}
        </h1>
        <p className="mt-2 text-body-sm leading-6 text-text-secondary">
          {isChunkError
            ? t("app.recovery.updateDescription")
            : t("common.error.description")}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={onReload} className="w-full">
            {t("app.recovery.reload")}
          </Button>
          {!isChunkError && (
            <Button variant="secondary" onClick={onRetry} className="w-full">
              {t("common.retry")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
