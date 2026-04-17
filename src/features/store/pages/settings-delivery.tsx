import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getDefaultDeliveryPlatforms } from "@/shared/i18n/presets";

const getDeliverySettingsKey = (storeId: string) =>
  `store:${storeId}:delivery-platforms`;

interface DeliveryPlatformSettings {
  supportedPlatforms: string[];
  enabledPlatforms: string[];
}

const isDeliveryPlatformSettings = (
  value: string[] | DeliveryPlatformSettings
): value is DeliveryPlatformSettings => {
  return (
    !Array.isArray(value) &&
    Array.isArray(value.supportedPlatforms) &&
    Array.isArray(value.enabledPlatforms)
  );
};

const SettingsDeliveryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const defaultDeliveryPlatforms = useMemo(
    () => getDefaultDeliveryPlatforms(language),
    [language]
  );
  const [supportedPlatforms, setSupportedPlatforms] = useState<string[]>(
    defaultDeliveryPlatforms
  );
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>(
    defaultDeliveryPlatforms
  );
  const [customPlatform, setCustomPlatform] = useState("");
  const storageKey = useMemo(() => (id ? getDeliverySettingsKey(id) : ""), [id]);

  useEffect(() => {
    setSupportedPlatforms(defaultDeliveryPlatforms);
    setEnabledPlatforms(defaultDeliveryPlatforms);
  }, [defaultDeliveryPlatforms]);

  useEffect(() => {
    if (!storageKey) return;

    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as
        | DeliveryPlatformSettings
        | string[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setSupportedPlatforms(Array.from(new Set([...defaultDeliveryPlatforms, ...parsed])));
        setEnabledPlatforms(parsed);
        return;
      }

      if (isDeliveryPlatformSettings(parsed)) {
        setSupportedPlatforms(parsed.supportedPlatforms);
        setEnabledPlatforms(parsed.enabledPlatforms);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [defaultDeliveryPlatforms, storageKey]);

  const persistPlatforms = (
    nextSupportedPlatforms: string[],
    nextEnabledPlatforms: string[]
  ) => {
    setSupportedPlatforms(nextSupportedPlatforms);
    setEnabledPlatforms(nextEnabledPlatforms);
    if (storageKey) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          supportedPlatforms: nextSupportedPlatforms,
          enabledPlatforms: nextEnabledPlatforms,
        })
      );
    }
  };

  const handleTogglePlatform = (platform: string, checked: boolean) => {
    if (checked) {
      persistPlatforms(supportedPlatforms, [...enabledPlatforms, platform]);
      return;
    }

    if (enabledPlatforms.length === 1) {
      return;
    }

    persistPlatforms(
      supportedPlatforms,
      enabledPlatforms.filter((item) => item !== platform)
    );
  };

  const handleAddCustomPlatform = () => {
    const nextPlatform = customPlatform.trim();
    if (!nextPlatform) return;
    if (enabledPlatforms.includes(nextPlatform)) {
      setCustomPlatform("");
      return;
    }

    persistPlatforms(
      [...supportedPlatforms, nextPlatform],
      [...enabledPlatforms, nextPlatform]
    );
    setCustomPlatform("");
  };

  return (
    <SettingsShell
      title={t("settings.delivery.title")}
      description={t("settings.delivery.description")}
      onBack={() => navigate(`/store/${id}/settings`)}
    >
      <SettingsSectionCard
        title={t("settings.delivery.supportedApps")}
        description={t("settings.delivery.supportedAppsDescription")}
        action={
          <div className="rounded-full bg-bg px-3.5 py-1.5 text-label font-[var(--weight-semibold)] text-text-primary">
            {enabledPlatforms.length}/{supportedPlatforms.length}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {supportedPlatforms.map((platform) => (
            <Card
              key={platform}
              className="flex min-h-36 flex-col justify-between bg-bg px-5 py-4 sm:px-6 sm:py-5"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="font-[var(--weight-semibold)] text-text-primary">
                  {platform}
                </div>
                <div className="text-label leading-6 text-text-secondary">
                  {enabledPlatforms.includes(platform)
                    ? t("settings.delivery.available")
                    : t("settings.delivery.hidden")}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <span className="text-label text-text-secondary">
                  {enabledPlatforms.includes(platform)
                    ? t("settings.delivery.enabled")
                    : t("settings.delivery.disabled")}
                </span>
                <Toggle
                  checked={enabledPlatforms.includes(platform)}
                  onChange={(checked) => handleTogglePlatform(platform, checked)}
                  label={`Toggle ${platform}`}
                  disabled={enabledPlatforms.length === 1}
                />
              </div>
            </Card>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title={t("settings.delivery.addCustomPlatform")}
        description={t("settings.delivery.addCustomPlatformDescription")}
      >
        <Card className="bg-bg p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1">
              <Input
                label={t("settings.delivery.platformName")}
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder={t("settings.delivery.platformNamePlaceholder")}
              />
            </div>
            <Button
              onClick={handleAddCustomPlatform}
              className="h-11 sm:min-w-44"
              disabled={customPlatform.trim().length === 0}
            >
              <LuPlus size={16} />
              {t("settings.delivery.addPlatform")}
            </Button>
          </div>
        </Card>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsDeliveryPage;
