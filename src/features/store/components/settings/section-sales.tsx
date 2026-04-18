import { useNavigate, useParams } from "react-router-dom";
import { LuBike, LuFileText } from "react-icons/lu";
import { Toggle } from "@/shared/components/ui/toggle";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useLocalSetting } from "@/shared/hooks/use-local-setting";

type OrderDefault = "dineIn" | "togo";

export function SectionSales() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const key = (k: string) => `store.${id}.sales.${k}`;

  const [useTable, setUseTable] = useLocalSetting(key("useTable"), true);
  const [useQueue, setUseQueue] = useLocalSetting(key("useQueue"), true);
  const [useNote, setUseNote] = useLocalSetting(key("useNote"), true);
  const [useOptions, setUseOptions] = useLocalSetting(key("useOptions"), false);
  const [defaultType, setDefaultType] = useLocalSetting<OrderDefault>(
    key("defaultType"),
    "dineIn",
  );

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
          control={<Toggle checked={useTable} onChange={setUseTable} />}
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useQueue")}
          control={<Toggle checked={useQueue} onChange={setUseQueue} />}
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useNote")}
          control={<Toggle checked={useNote} onChange={setUseNote} />}
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.useOptions")}
          control={<Toggle checked={useOptions} onChange={setUseOptions} />}
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.sales.default.label")}
          control={
            <div className="flex gap-2">
              <ChipTab
                size="sm"
                active={defaultType === "dineIn"}
                onClick={() => setDefaultType("dineIn")}
              >
                {t("settings.cp.sales.default.dineIn")}
              </ChipTab>
              <ChipTab
                size="sm"
                active={defaultType === "togo"}
                onClick={() => setDefaultType("togo")}
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
