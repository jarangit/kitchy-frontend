import { useState } from "react";
import { LuArrowRight, LuCoffee, LuSandwich, LuSoup } from "react-icons/lu";
import { BrandMark } from "@/shared/components/ui/brand-mark";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/shared/hooks/hooks";
import { setCurrentStore } from "@/shared/store/slices/current-store-slice";
import { setCurrentStation } from "@/shared/store/slices/current-station-slice";
import { onboardingStorage } from "@/features/onboarding/utils/onboarding-storage";
import { clearDemoData } from "@/shared/services/adapters/reset-demo";
import {
  DEMO_STATION_ID,
  DEMO_STATION_NAME,
  DEMO_STORE_ID,
  DEMO_STORE_PRESET_STORAGE_KEY,
  getDemoStoreName,
  type DemoStorePreset,
} from "@/shared/services/adapters/seed-data";
import { cn } from "@/shared/utils/cn";

const STORE_PRESET_OPTIONS: Array<{
  value: DemoStorePreset;
  icon: typeof LuCoffee;
  labelKey:
    | "demo.trial.storePreset.cafe"
    | "demo.trial.storePreset.fastFood"
    | "demo.trial.storePreset.madeToOrder";
  iconClassName: string;
}> = [
  {
    value: "CAFE",
    icon: LuCoffee,
    labelKey: "demo.trial.storePreset.cafe",
    iconClassName: "bg-info-bg text-info",
  },
  {
    value: "FAST_FOOD",
    icon: LuSandwich,
    labelKey: "demo.trial.storePreset.fastFood",
    iconClassName: "bg-warning-bg text-warning",
  },
  {
    value: "MADE_TO_ORDER",
    icon: LuSoup,
    labelKey: "demo.trial.storePreset.madeToOrder",
    iconClassName: "bg-success-bg text-success",
  },
];

export default function DemoTrialEntryPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const [selectedStorePreset, setSelectedStorePreset] = useState<DemoStorePreset | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartTrial = async () => {
    if (!selectedStorePreset) return;

    try {
      setIsStarting(true);
      window.localStorage.setItem(DEMO_STORE_PRESET_STORAGE_KEY, selectedStorePreset);
      clearDemoData();
      onboardingStorage.resetStore(DEMO_STORE_ID);
      onboardingStorage.setShopType(DEMO_STORE_ID, "DINE_IN");
      onboardingStorage.setActive(DEMO_STORE_ID, false);

      dispatch(
        setCurrentStore({
          storeId: DEMO_STORE_ID,
          storeName: getDemoStoreName(selectedStorePreset),
        }),
      );
      dispatch(
        setCurrentStation({
          stationId: DEMO_STATION_ID,
          stationName: DEMO_STATION_NAME,
        }),
      );

      await auth?.loginAsDemo();
      window.location.assign(`/store/${DEMO_STORE_ID}/pos`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="page-shell-loose min-h-screen bg-bg">
      <main className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[72rem] flex-col items-stretch justify-center gap-4 px-5 py-3 sm:px-6 sm:py-4 lg:gap-5 lg:px-8 lg:py-5 xl:min-h-[calc(100dvh-5rem)] xl:gap-6 xl:px-10 xl:py-8">
        <section className="mx-auto flex max-w-xl flex-col items-center gap-3 py-1 text-center sm:gap-3.5 xl:max-w-2xl xl:gap-4 xl:py-3">
          <div className="flex items-center justify-center gap-2.5">
            <BrandMark size="sm" className="rounded-full" />
            <span className="text-body font-medium text-text-primary">Kitchy Demo</span>
          </div>

          <div className="flex flex-col items-center gap-3 xl:gap-3.5">
            <h1 className="text-title text-text-primary xl:text-display">
              {t("demo.trial.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-body-sm leading-6 text-text-secondary sm:text-body">
              {t("demo.trial.subtitle")}
            </p>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:gap-4 lg:gap-4.5 xl:gap-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 xl:gap-4">
            {STORE_PRESET_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = selectedStorePreset === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStorePreset(option.value)}
                  disabled={isStarting}
                  className={cn(
                    "group min-h-26 rounded-card border border-card-border bg-card-bg px-4 py-3.5 text-center transition-colors duration-[var(--motion-fast)] sm:min-h-30 sm:px-4 sm:py-4 xl:min-h-36 xl:px-5 xl:py-6",
                    "hover:border-border-hover hover:bg-card-bg-hover",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    selected && "border-accent bg-accent/4",
                  )}
                  aria-pressed={selected}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2.5 sm:gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-[var(--motion-fast)] xl:h-14 xl:w-14",
                        selected ? "bg-accent/10 text-accent" : option.iconClassName,
                      )}
                    >
                      <Icon size={18} />
                    </div>

                    <p className={cn(
                      "text-body font-medium text-text-primary transition-colors duration-[var(--motion-fast)] sm:text-subtitle",
                      selected && "text-accent",
                    )}>
                      {t(option.labelKey)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2 text-center sm:gap-2.5">
            {selectedStorePreset ? (
              <>
                <p className="text-body-sm font-medium text-text-primary sm:text-body">
                  {t(STORE_PRESET_OPTIONS.find((option) => option.value === selectedStorePreset)?.labelKey ?? "demo.trial.storePreset.madeToOrder")}
                </p>
                <p className="max-w-2xl text-label leading-5 text-text-secondary sm:text-body-sm sm:leading-6">
                  {t("demo.trial.chooseTypeHint")}
                </p>
              </>
            ) : (
              <p className="text-label leading-5 text-text-secondary sm:text-body-sm sm:leading-6">
                {t("demo.trial.selectPrompt")}
              </p>
            )}
          </div>

          <Button
            size="md"
            onClick={handleStartTrial}
            disabled={!selectedStorePreset || isStarting}
            loading={isStarting}
            loadingText="กำลังเตรียมร้านเดโม..."
            className="mx-auto mt-1 w-full max-w-xs sm:max-w-sm"
          >
            {t("demo.trial.start")}
            {!isStarting && <LuArrowRight size={18} aria-hidden="true" />}
          </Button>
        </section>
      </main>
    </div>
  );
}
