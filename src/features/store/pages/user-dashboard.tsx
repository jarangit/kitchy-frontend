import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useAppDispatch } from "@/shared/hooks/hooks";
import { clearCurrentStore, setCurrentStore } from "@/shared/store/slices/current-store-slice";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { IStore } from "@/features/store/types/store.model";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuStore } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";

export default function UserDashboard() {
  const auth = useAuth();
  const { user } = auth || {};
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;

  const { stores, storesLoading } = useStoreService({ userId });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // First-run users (e.g. after Google sign-up) shouldn't have to click
  // through an empty dashboard — drop them straight into onboarding.
  useEffect(() => {
    if (!storesLoading && stores && stores.length === 0) {
      navigate("/onboarding", { replace: true });
    }
  }, [storesLoading, stores, navigate]);

  const handleLogout = () => {
    dispatch(clearCurrentStore());
    auth?.logout();
  };

  const handleCreateStore = () => {
    navigate("/onboarding");
  };

  if (storesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-body-sm text-text-tertiary">
          {t("store.dashboard.loading")}
        </p>
      </div>
    );
  }

  const hasStores = stores && stores.length > 0;
  const isMultiStoreLocked = hasStores;

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-bg/95 backdrop-blur-xl">
        <div className="page-inline mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface">
              <span className="text-label font-semibold text-text-primary">
                K
              </span>
            </div>
            <span className="text-body font-medium text-text-primary tracking-tight">
              Kitchy
            </span>
            <span className="hidden h-4 w-px bg-border sm:inline-block" />
            <span className="hidden text-caption text-text-tertiary sm:inline">
              {t("store.dashboard.header.breadcrumb")}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-3 sm:ml-auto">
            <span className="hidden max-w-[18rem] truncate text-caption text-text-tertiary md:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              {t("store.dashboard.header.signOut")}
            </Button>
          </div>
        </div>
      </header>

      <main className="page-shell-loose mx-auto max-w-6xl">
        <div className="page-stack-loose">
          <div className="page-title-stack">
            <p className="text-label text-text-secondary">
              {t("store.dashboard.welcome.eyebrow")}
            </p>
            <h1 className="text-display text-text-primary">
              {t("store.dashboard.welcome.title")}
            </h1>
            <p className="text-body-sm text-text-tertiary">
              {user?.email}
            </p>
          </div>

          <section className="page-stack-tight">
            <div className="page-title-stack">
              <h2 className="text-heading text-text-primary">
                {t("store.dashboard.section.title")}
              </h2>
              <p className="text-body-sm text-text-tertiary">
                {t("store.dashboard.section.description")}
              </p>
            </div>

            {hasStores ? (
              <div className="page-grid-loose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {stores.map((item: IStore) => (
                  <button
                    key={item.id}
                    type="button"
                    className="cursor-pointer text-left"
                    onClick={() => {
                      dispatch(
                        setCurrentStore({
                          storeId: String(item.id),
                          storeName: item.name,
                        })
                      );
                      navigate(`/store/${item.id}`);
                    }}
                  >
                    <Card className="min-h-44 bg-surface transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
                      <CardContent className="flex h-full flex-col justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-text-tertiary">
                          <LuStore size={18} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-subtitle text-text-primary line-clamp-2">{item.name}</p>
                          <p className="text-body-sm leading-6 text-text-tertiary">
                            {t("store.dashboard.card.open")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}

                {isMultiStoreLocked ? (
                  <div
                    role="group"
                    aria-disabled="true"
                    className="text-left"
                  >
                    <Card className="flex min-h-44 items-center justify-center border-dashed border-border/60 bg-bg text-center">
                      <CardContent className="flex flex-col items-center gap-3 py-8">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-text-tertiary">
                          <LuPlus size={18} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-body text-text-secondary">
                            {t("store.dashboard.create.locked.title")}
                          </p>
                          <Badge variant="default" size="sm">
                            {t("store.dashboard.create.locked.badge")}
                          </Badge>
                          <p className="max-w-[220px] text-caption leading-5 text-text-tertiary">
                            {t("store.dashboard.create.locked.hint")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer text-left"
                    onClick={handleCreateStore}
                  >
                    <Card className="flex min-h-44 items-center justify-center border-dashed bg-bg text-center transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
                      <CardContent className="flex flex-col items-center gap-3 py-8">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-text-tertiary">
                          <LuPlus size={18} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-body text-text-secondary">
                            {t("store.dashboard.create.locked.title")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                )}
              </div>
            ) : (
              <EmptyState
                icon={<LuStore size={48} />}
                title={t("store.dashboard.empty.title")}
                description={t("store.dashboard.empty.description")}
                action={
                  <Button onClick={handleCreateStore}>
                    {t("store.dashboard.empty.action")}
                  </Button>
                }
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
