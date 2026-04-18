import { LuMonitor, LuPlus } from "react-icons/lu";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";

export function SectionDevices() {
  const { t } = useTranslation();

  // Placeholder: real device list will come from backend later.
  const devices: { id: string; name: string; online: boolean }[] = [];

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.devices")}
        description={t("settings.cp.section.devices.description")}
      />
      <SettingGroup>
        {devices.length === 0 ? (
          <SettingRow
            variant="display"
            icon={<LuMonitor size={18} />}
            label={t("settings.cp.devices.empty")}
          />
        ) : (
          devices.map((d) => (
            <SettingRow
              key={d.id}
              variant="display"
              icon={<LuMonitor size={18} />}
              label={d.name}
              value={
                d.online
                  ? t("settings.cp.devices.online")
                  : t("settings.cp.devices.offline")
              }
            />
          ))
        )}
        <SettingRow
          variant="action"
          icon={<LuPlus size={18} />}
          label={t("settings.cp.devices.add")}
          onClick={() => {
            /* placeholder: future device pairing flow */
          }}
        />
      </SettingGroup>
    </div>
  );
}
