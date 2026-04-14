import { Link, useParams } from "react-router-dom";
import { LuBike, LuFileText, LuPackage, LuShapes, LuStore, LuSun, LuMoon, LuChevronRight } from "react-icons/lu";
import { useTheme } from "@/shared/hooks/useTheme";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";

const SettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleTheme, isDark } = useTheme();
  const { t, language, setLanguage } = useTranslation();

  const settingsMenu = [
    {
      name: t("settings.menu.products.name"),
      description: t("settings.menu.products.description"),
      path: "products",
      icon: <LuPackage size={24} />,
    },
    {
      name: t("settings.menu.stations.name"),
      description: t("settings.menu.stations.description"),
      path: "stations",
      icon: <LuShapes size={24} />,
    },
    {
      name: t("settings.menu.categories.name"),
      description: t("settings.menu.categories.description"),
      path: "categories",
      icon: <LuShapes size={24} />,
    },
    {
      name: t("settings.menu.shop.name"),
      description: t("settings.menu.shop.description"),
      path: "shop",
      icon: <LuStore size={24} />,
    },
    {
      name: t("settings.menu.delivery.name"),
      description: t("settings.menu.delivery.description"),
      path: "delivery",
      icon: <LuBike size={24} />,
    },
    {
      name: t("settings.menu.quickNotes.name"),
      description: t("settings.menu.quickNotes.description"),
      path: "quick-notes",
      icon: <LuFileText size={24} />,
    },
  ];

  return (
    <SettingsShell
      title={t("settings.title")}
      description={t("settings.description")}
    >
      <SettingsSectionCard title={t("settings.management")}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingsMenu.map((item) => (
            <Link
              key={item.path}
              to={`/store/${id}/settings/${item.path}`}
              className="flex min-h-40 flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-5 transition-all duration-[var(--motion-fast)] hover:border-[var(--color-border-hover)] active:scale-[0.98]"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                  {item.icon}
                </div>
                <LuChevronRight size={20} className="shrink-0 text-[var(--color-text-tertiary)]" />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-[var(--color-text-primary)]">{item.name}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title={t("settings.display")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                {isDark ? <LuMoon size={24} /> : <LuSun size={24} />}
              </div>
              <div>
                <div className="font-semibold text-[var(--color-text-primary)]">{t("settings.theme.title")}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {isDark ? t("settings.theme.dark") : t("settings.theme.light")}
                </div>
              </div>
            </div>

            <Toggle
              checked={isDark}
              onChange={toggleTheme}
              label={t("settings.theme.title")}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-5">
            <div>
              <div className="font-semibold text-[var(--color-text-primary)]">{t("settings.language.title")}</div>
              <div className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                {t("settings.language.description")}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage("th")}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
                  language === "th"
                    ? "border-[var(--button-primary-bg)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                }`}
              >
                {t("settings.language.th")}
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
                  language === "en"
                    ? "border-[var(--button-primary-bg)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                }`}
              >
                {t("settings.language.en")}
              </button>
            </div>
          </div>
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsPage;
