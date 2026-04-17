import { Link, useParams } from "react-router-dom";
import { LuBike, LuFileText, LuPackage, LuShapes, LuStore, LuSun, LuMoon, LuChevronRight } from "react-icons/lu";
import { useTheme } from "@/shared/hooks/useTheme";
import { Toggle } from "@/shared/components/ui/toggle";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { Card, CardContent } from "@/shared/components/ui/card";
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
              className="block"
            >
              <Card className="flex min-h-40 flex-col bg-bg transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
                <CardContent className="flex h-full flex-col">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-text-secondary">
                      {item.icon}
                    </div>
                    <LuChevronRight size={20} className="shrink-0 text-text-tertiary" />
                  </div>

                  <div className="flex-1">
                    <div className="text-subtitle text-text-primary">{item.name}</div>
                    <div className="mt-1 text-body-sm leading-6 text-text-secondary">
                      {item.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title={t("settings.display")}>
        <div className="space-y-4">
          <Card className="bg-bg">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-text-secondary">
                  {isDark ? <LuMoon size={24} /> : <LuSun size={24} />}
                </div>
                <div>
                  <div className="text-subtitle text-text-primary">{t("settings.theme.title")}</div>
                  <div className="mt-1 text-body-sm leading-6 text-text-secondary">
                    {isDark ? t("settings.theme.dark") : t("settings.theme.light")}
                  </div>
                </div>
              </div>

              <Toggle
                checked={isDark}
                onChange={toggleTheme}
                label={t("settings.theme.title")}
              />
            </CardContent>
          </Card>

          <Card className="bg-bg">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="text-subtitle text-text-primary">{t("settings.language.title")}</div>
                <div className="mt-1 text-body-sm leading-6 text-text-secondary">
                  {t("settings.language.description")}
                </div>
              </div>

              <div className="flex gap-2">
                <ChipTab
                  size="sm"
                  active={language === "th"}
                  onClick={() => setLanguage("th")}
                >
                  {t("settings.language.th")}
                </ChipTab>
                <ChipTab
                  size="sm"
                  active={language === "en"}
                  onClick={() => setLanguage("en")}
                >
                  {t("settings.language.en")}
                </ChipTab>
              </div>
            </CardContent>
          </Card>
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsPage;
