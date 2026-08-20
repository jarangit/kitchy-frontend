import {
  LuBanknote,
  LuQrCode,
  LuLandmark,
  LuWallet,
  LuPlus,
} from "react-icons/lu";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";

export function SectionPayments() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useStoreSettings();
  const payments = settings.payments;

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.payments")}
        description={t("settings.cp.section.payments.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="control"
          icon={<LuBanknote size={18} />}
          label={t("settings.cp.payments.cash")}
          control={
            <Toggle
              checked={payments.cash}
              onChange={(checked) =>
                updateSettings({ payments: { cash: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          icon={<LuQrCode size={18} />}
          label={t("settings.cp.payments.qr")}
          hint={t("settings.cp.payments.qr.hint")}
          control={
            <Toggle
              checked={payments.qr}
              onChange={(checked) =>
                updateSettings({ payments: { qr: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          icon={<LuLandmark size={18} />}
          label={t("settings.cp.payments.bank")}
          hint={t("settings.cp.payments.bank.hint")}
          control={
            <Toggle
              checked={payments.bank}
              onChange={(checked) =>
                updateSettings({ payments: { bank: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          icon={<LuWallet size={18} />}
          label={t("settings.cp.payments.truemoney")}
          control={
            <Toggle
              checked={payments.truemoney}
              onChange={(checked) =>
                updateSettings({ payments: { truemoney: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="action"
          icon={<LuPlus size={18} />}
          label={t("settings.cp.payments.add")}
          onClick={() => {
            /* placeholder: future add-channel flow */
          }}
        />
      </SettingGroup>
    </div>
  );
}
