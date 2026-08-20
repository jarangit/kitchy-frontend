import { Toggle } from "@/shared/components/ui/toggle";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { SettingsSectionHeader } from "../settings-section-header";

export function SectionSafety() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useStoreSettings();
  const safety = settings.safety;

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.safety")}
        description={t("settings.cp.section.safety.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="control"
          label={t("settings.cp.safety.confirmDelete")}
          control={
            <Toggle
              checked={safety.confirmDelete}
              onChange={(checked) =>
                updateSettings({ safety: { confirmDelete: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.safety.confirmRefund")}
          control={
            <Toggle
              checked={safety.confirmRefund}
              onChange={(checked) =>
                updateSettings({ safety: { confirmRefund: checked } })
              }
            />
          }
        />
      </SettingGroup>
    </div>
  );
}
