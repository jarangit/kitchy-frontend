import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";

export function SectionStore() {
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { t } = useTranslation();
  const { storeFinOneQuery, updateStore } = useStoreService({ userId });
  const { settings, updateSettings } = useStoreSettings();

  const storeName = storeFinOneQuery?.name ?? "";

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.store")}
        description={t("settings.cp.section.store.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="editable"
          label={t("settings.cp.store.name.label")}
          placeholder={t("settings.cp.store.name.placeholder")}
          value={storeName}
          onSave={(next) => {
            if (!next || next === storeName) return;
            updateStore({ storeData: { name: next } });
          }}
        />
        <SettingRow
          variant="editable"
          label={t("settings.cp.store.promptpay.label")}
          placeholder={t("settings.cp.store.promptpay.placeholder")}
          value={settings.promptpay}
          onSave={(next) => updateSettings({ promptpay: next })}
          type="tel"
        />
        <SettingRow
          variant="editable"
          label={t("settings.cp.store.hours.label")}
          placeholder={t("settings.cp.store.hours.placeholder")}
          value={settings.hours}
          onSave={(next) => updateSettings({ hours: next })}
        />
        <SettingRow
          variant="editable"
          label={t("settings.cp.store.dailyRevenueTarget.label")}
          placeholder={t("settings.cp.store.dailyRevenueTarget.placeholder")}
          value={settings.dailyRevenueTarget}
          onSave={(next) =>
            updateSettings({
              dailyRevenueTarget: next.replace(/[^0-9]/g, ""),
            })
          }
          type="number"
        />
      </SettingGroup>
    </div>
  );
}
