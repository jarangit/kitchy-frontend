import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuX } from "react-icons/lu";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { useStoreContextSync } from "@/shared/hooks/use-store-context-sync";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  children: ReactNode;
  /**
   * If true, renders the shell without the inner container width cap.
   * Useful for sub-pages that bring their own content layout and want to
   * breathe the full viewport width.
   */
  wide?: boolean;
}

/**
 * Full-screen chrome for the Settings experience.
 *
 * Intent: when the user enters Settings, they leave the main app frame and
 * step into a focused "mode" — akin to macOS System Settings or iOS Settings.
 * The global app sidebar is hidden; only a slim top bar with a close action
 * and the section title remains.
 *
 * Side-effects (store id / station sync / auto-reload) are preserved via
 * `useStoreContextSync` so behaviour matches the rest of the app.
 */
export function SettingsFrame({ children, wide = false }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isOnline = useNetworkStatus();
  useStoreContextSync();

  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const resolvedStoreId = storeId ?? id;

  const handleClose = () => {
    if (resolvedStoreId) {
      navigate(`/store/${resolvedStoreId}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("common.close")}
            title={t("common.close")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LuX size={20} />
          </button>
          <h1 className="text-title font-[var(--weight-semibold)] text-text-primary">
            {t("settings.cp.title")}
          </h1>
        </div>
        {!isOnline && (
          <div className="w-full bg-danger-bg py-2 text-center text-label font-[var(--weight-medium)] text-danger">
            You are offline
          </div>
        )}
      </header>

      {/* Content container */}
      <main
        className={
          wide
            ? "px-4 py-6 sm:px-6 lg:px-10 lg:py-10"
            : "mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10"
        }
      >
        {children}
      </main>
    </div>
  );
}
