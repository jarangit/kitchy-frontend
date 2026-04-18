import { useParams } from "react-router-dom";
import { Toggle } from "@/shared/components/ui/toggle";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useLocalSetting } from "@/shared/hooks/use-local-setting";
import { SettingsSectionHeader } from "../settings-section-header";

export function SectionSafety() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const key = (k: string) => `store.${id}.safety.${k}`;

  const [confirmDelete, setConfirmDelete] = useLocalSetting(
    key("confirmDelete"),
    true,
  );
  const [confirmRefund, setConfirmRefund] = useLocalSetting(
    key("confirmRefund"),
    true,
  );

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
            <Toggle checked={confirmDelete} onChange={setConfirmDelete} />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.safety.confirmRefund")}
          control={
            <Toggle checked={confirmRefund} onChange={setConfirmRefund} />
          }
        />
      </SettingGroup>
    </div>
  );
}
