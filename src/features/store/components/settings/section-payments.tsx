import { useParams } from "react-router-dom";
import { LuBanknote, LuQrCode, LuLandmark, LuWallet, LuPlus } from "react-icons/lu";
import { Toggle } from "@/shared/components/ui/toggle";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useLocalSetting } from "@/shared/hooks/use-local-setting";

export function SectionPayments() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const key = (k: string) => `store.${id}.payments.${k}`;

  const [cash, setCash] = useLocalSetting(key("cash"), true);
  const [qr, setQr] = useLocalSetting(key("qr"), true);
  const [bank, setBank] = useLocalSetting(key("bank"), false);
  const [truemoney, setTrueMoney] = useLocalSetting(key("truemoney"), false);

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
          control={<Toggle checked={cash} onChange={setCash} />}
        />
        <SettingRow
          variant="control"
          icon={<LuQrCode size={18} />}
          label={t("settings.cp.payments.qr")}
          hint={t("settings.cp.payments.qr.hint")}
          control={<Toggle checked={qr} onChange={setQr} />}
        />
        <SettingRow
          variant="control"
          icon={<LuLandmark size={18} />}
          label={t("settings.cp.payments.bank")}
          hint={t("settings.cp.payments.bank.hint")}
          control={<Toggle checked={bank} onChange={setBank} />}
        />
        <SettingRow
          variant="control"
          icon={<LuWallet size={18} />}
          label={t("settings.cp.payments.truemoney")}
          control={<Toggle checked={truemoney} onChange={setTrueMoney} />}
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
