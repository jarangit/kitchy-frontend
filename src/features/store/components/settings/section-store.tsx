import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useLocalSetting } from "@/shared/hooks/use-local-setting";

export function SectionStore() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { t } = useTranslation();
  const { storeFinOneQuery, updateStore } = useStoreService({ userId });

  const storeName = storeFinOneQuery?.name ?? "";

  const [promptpay, setPromptpay] = useLocalSetting(
    `store.${id}.promptpay`,
    "",
  );
  const [hours, setHours] = useLocalSetting(`store.${id}.hours`, "");

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
          value={promptpay}
          onSave={setPromptpay}
          type="tel"
        />
        <SettingRow
          variant="editable"
          label={t("settings.cp.store.hours.label")}
          placeholder={t("settings.cp.store.hours.placeholder")}
          value={hours}
          onSave={setHours}
        />
      </SettingGroup>
    </div>
  );
}
