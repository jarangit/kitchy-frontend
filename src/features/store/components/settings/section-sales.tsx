import { useNavigate, useParams } from "react-router-dom";
import { LuBike, LuFileText } from "react-icons/lu";
import { Toggle } from "@/shared/components/ui/toggle";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";

export function SectionSales() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings, updateSettings } = useStoreSettings();
  const sales = settings.sales;

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.sales")}
        description={t("settings.cp.section.sales.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useTable")}
          control={
            <Toggle
              checked={sales.useTable}
              onChange={(checked) =>
                updateSettings({ sales: { useTable: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useQueue")}
          control={
            <Toggle
              checked={sales.useQueue}
              onChange={(checked) =>
                updateSettings({ sales: { useQueue: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useNote")}
          control={
            <Toggle
              checked={sales.useNote}
              onChange={(checked) =>
                updateSettings({ sales: { useNote: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useOptions")}
          control={
            <Toggle
              checked={sales.useOptions}
              onChange={(checked) =>
                updateSettings({ sales: { useOptions: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.default.label")}
          control={
            <div className="flex gap-3">
              <ChipTab
                size="sm"
                active={sales.defaultType === "dineIn"}
                onClick={() =>
                  updateSettings({ sales: { defaultType: "dineIn" } })
                }
              >
                {t("settings.cp.sales.default.dineIn")}
              </ChipTab>
              <ChipTab
                size="sm"
                active={sales.defaultType === "togo"}
                onClick={() =>
                  updateSettings({ sales: { defaultType: "togo" } })
                }
              >
                {t("settings.cp.sales.default.togo")}
              </ChipTab>
            </div>
          }
        />
      </SettingGroup>

      <SettingGroup title={t("settings.cp.sales.more")}>
        <SettingRow
          variant="link"
          icon={<LuBike size={18} />}
          label={t("settings.menu.delivery.name")}
          hint={t("settings.menu.delivery.description")}
          onClick={() => navigate(`/store/${id}/settings/delivery`)}
        />
        <SettingRow
          variant="link"
          icon={<LuFileText size={18} />}
          label={t("settings.menu.quickNotes.name")}
          hint={t("settings.menu.quickNotes.description")}
          onClick={() => navigate(`/store/${id}/settings/quick-notes`)}
        />
      </SettingGroup>
    </div>
  );
}
