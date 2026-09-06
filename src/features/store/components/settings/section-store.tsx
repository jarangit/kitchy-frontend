import { useNavigate } from "react-router-dom";
import { LuArrowLeftRight, LuMoon, LuSun, LuVolume2 } from "react-icons/lu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { Toggle } from "@/shared/components/ui/toggle";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { SectionDevices } from "@/features/store/components/settings/section-devices";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { setSound } from "@/shared/store/slices/notice-slice";

export function SectionStore() {
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { t, language, setLanguage } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { storeFinOneQuery, updateStore } = useStoreService({ userId });
  const { settings, updateSettings } = useStoreSettings();
  const dispatch = useAppDispatch();
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);

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

      <SectionDevices />

      <SettingGroup title={t("settings.sound.title")}>
        <SettingRow
          variant="control"
          icon={<LuVolume2 size={18} />}
          label={t("settings.sound.title")}
          hint={t("settings.sound.hint")}
          control={
            <Toggle
              checked={isSoundOn}
              onChange={(checked) => dispatch(setSound(checked))}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t("settings.cp.section.display")}>
        <SettingRow
          variant="control"
          icon={isDark ? <LuMoon size={18} /> : <LuSun size={18} />}
          label={t("settings.theme.title")}
          hint={isDark ? t("settings.theme.dark") : t("settings.theme.light")}
          control={<Toggle checked={isDark} onChange={toggleTheme} />}
        />
        <SettingRow
          variant="control"
          label={t("settings.language.title")}
          hint={t("settings.language.description")}
          control={
            <div className="flex gap-3">
              <ChipTab
                size="sm"
                active={language === "th"}
                onClick={() => setLanguage("th")}
              >
                {t("settings.language.th")}
              </ChipTab>
              <ChipTab
                size="sm"
                active={language === "en"}
                onClick={() => setLanguage("en")}
              >
                {t("settings.language.en")}
              </ChipTab>
            </div>
          }
        />
      </SettingGroup>

      <SettingGroup>
        <SettingRow
          variant="action"
          icon={<LuArrowLeftRight size={18} />}
          label={t("settings.shop.switchStore")}
          hint={t("settings.shop.switchStorePrompt")}
          onClick={() => navigate("/dashboard")}
        />
      </SettingGroup>
    </div>
  );
}
