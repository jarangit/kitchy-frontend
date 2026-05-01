import { useNavigate } from "react-router-dom";
import StationListTemplate from "@/features/station/components/station-list";
import { SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";

const SettingsStationsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = useStoreRouteParam();

  return (
    <SettingsShell
      title={t("settings.menu.stations.name")}
      description={t("settings.menu.stations.description")}
      onBack={() => navigate(`/store/${resolvedStoreId}/settings`)}
    >
      <StationListTemplate />
    </SettingsShell>
  );
};

export default SettingsStationsPage;
