import { useNavigate, useParams } from "react-router-dom";
import StationListTemplate from "@/features/station/components/station-list";
import { SettingsShell } from "@/features/store/components/settings-shell";

const SettingsCategoriesPage = () => {
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const navigate = useNavigate();
  const resolvedStoreId = id ?? storeId;

  return (
    <SettingsShell
      title="Category Management"
      description="Categories are managed through stations. Each station acts as a category for grouping products."
      onBack={() => navigate(`/store/${resolvedStoreId}/settings`)}
    >
      <StationListTemplate />
    </SettingsShell>
  );
};

export default SettingsCategoriesPage;
