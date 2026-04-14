import { useNavigate, useParams } from "react-router-dom";
import StationListTemplate from "@/features/station/components/station-list";
import { SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";

const SettingsCategoriesPage = () => {
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = id ?? storeId;

  return (
    <SettingsShell
      title={t("settings.categories.title")}
      description={t("settings.categories.description")}
      onBack={() => navigate(`/store/${resolvedStoreId}/settings`)}
    >
      <StationListTemplate />
    </SettingsShell>
  );
};

export default SettingsCategoriesPage;
