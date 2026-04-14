import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";

const DEFAULT_DELIVERY_PLATFORMS = [
  "LINE MAN",
  "GrabFood",
  "ShopeeFood",
  "Robinhood",
  "Foodpanda",
  "Other",
];

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
  const [supportedPlatforms, setSupportedPlatforms] = useState<string[]>(
    DEFAULT_DELIVERY_PLATFORMS
  );
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>(
    DEFAULT_DELIVERY_PLATFORMS
  );
  const [customPlatform, setCustomPlatform] = useState("");
  const storageKey = useMemo(() => (id ? getDeliverySettingsKey(id) : ""), [id]);

  useEffect(() => {
    if (!storageKey) return;

    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as
        | DeliveryPlatformSettings
        | string[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setSupportedPlatforms(Array.from(new Set([...DEFAULT_DELIVERY_PLATFORMS, ...parsed])));
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
  }, [storageKey]);

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
      title="Delivery Platforms"
      description="Choose which delivery apps your store accepts in POS. These options are saved per store on this device."
      onBack={() => navigate(`/store/${id}/settings`)}
    >
      <SettingsSectionCard
        title="Supported Apps"
        description="Disable apps your store does not use. At least one platform must stay enabled."
        action={
          <div className="rounded-full bg-[var(--color-bg)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
            {enabledPlatforms.length}/{supportedPlatforms.length}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {supportedPlatforms.map((platform) => (
            <div
              key={platform}
              className="flex min-h-36 flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4 sm:px-6 sm:py-5"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="font-semibold text-[var(--color-text-primary)]">
                  {platform}
                </div>
                <div className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  {enabledPlatforms.includes(platform)
                    ? "Available in delivery orders"
                    : "Hidden from delivery orders"}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {enabledPlatforms.includes(platform) ? "Enabled" : "Disabled"}
                </span>
                <Toggle
                  checked={enabledPlatforms.includes(platform)}
                  onChange={(checked) => handleTogglePlatform(platform, checked)}
                  label={`Toggle ${platform}`}
                  disabled={enabledPlatforms.length === 1}
                />
              </div>
            </div>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Add Custom Platform"
        description="Add other delivery partners your store supports. New platforms are enabled immediately."
      >
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1">
              <Input
                label="Platform name"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="Add custom delivery app"
              />
            </div>
            <Button
              onClick={handleAddCustomPlatform}
              className="h-11 sm:min-w-44"
              disabled={customPlatform.trim().length === 0}
            >
              <LuPlus size={16} />
              Add Platform
            </Button>
          </div>
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsDeliveryPage;
