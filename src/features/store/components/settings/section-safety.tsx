import { useState } from "react";
import { LuLock, LuLockOpen } from "react-icons/lu";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { SettingsPinDialog } from "@/features/store/components/settings-pin-dialog";
import {
  clearStorePinCache,
  hasStorePin,
  setStorePinCache,
} from "@/features/store/utils/store-pin-cache";
import { useStorePin } from "@/features/store/hooks/useStorePin";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { SettingsSectionHeader } from "../settings-section-header";

type PinFlow = "none" | "create" | "enter";

export function SectionSafety() {
  const { t } = useTranslation();
  const storeId = useStoreRouteParam() ?? "";
  const { settings, updateSettings } = useStoreSettings();
  const safety = settings.safety;
  const cached = storeId ? hasStorePin(storeId) : false;
  const [flow, setFlow] = useState<PinFlow>("none");
  const { setPinFirstTime } = useStorePin();

  const closeFlow = () => setFlow("none");

  const handleCreateConfirm = async (pin: string) => {
    try {
      await setPinFirstTime(pin);
      closeFlow();
    } catch {
      // error handled inside hook with toast
    }
  };

  const handleEnterVerify = (pin: string) => {
    if (storeId) setStorePinCache(storeId, pin);
    closeFlow();
    return true;
  };

  const handleClear = () => {
    if (storeId) clearStorePinCache(storeId);
    closeFlow();
  };

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

      <SettingGroup
        title={t("settings.cp.safety.settingsPin")}
        description={t("settings.cp.safety.settingsPin.hint")}
      >
        <SettingRow
          variant="display"
          icon={cached ? <LuLock size={18} /> : <LuLockOpen size={18} />}
          label={t("settings.cp.safety.settingsPin")}
          value={
            cached
              ? t("settings.cp.safety.settingsPin.set")
              : t("settings.cp.safety.settingsPin.notSet")
          }
        />
        {!cached ? (
          <>
            <SettingRow
              variant="action"
              label={t("settings.cp.safety.settingsPin.setPin")}
              onClick={() => setFlow("create")}
            />
            <SettingRow
              variant="action"
              label={t("settings.pin.verify.title")}
              onClick={() => setFlow("enter")}
            />
          </>
        ) : (
          <>
            <SettingRow
              variant="action"
              label={t("settings.cp.safety.settingsPin.changePin")}
              onClick={() => setFlow("enter")}
            />
            <SettingRow
              variant="action"
              label={
                <span className="text-danger">
                  {t("settings.cp.safety.settingsPin.removePin")}
                </span>
              }
              onClick={handleClear}
            />
          </>
        )}
      </SettingGroup>

      <SettingsPinDialog
        open={flow === "create"}
        mode="create"
        onClose={closeFlow}
        onVerify={() => {}}
        onCreateConfirm={handleCreateConfirm}
      />

      <SettingsPinDialog
        open={flow === "enter"}
        mode="verify"
        onClose={closeFlow}
        onVerify={handleEnterVerify}
      />
    </div>
  );
}
