import { useNavigate, useParams } from "react-router-dom";
import StationListTemplate from "@/features/station/components/station-list";
import { LuArrowLeft } from "react-icons/lu";

const SettingsCategoriesPage = () => {
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const navigate = useNavigate();
  const resolvedStoreId = id ?? storeId;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/store/${resolvedStoreId}/settings`)}
        className="min-h-11 px-2 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
      >
        <LuArrowLeft size={16} />
        Back to Settings
      </button>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
        Category Management
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Categories are managed through stations. Each station acts as a
        category for grouping products.
      </p>

      <StationListTemplate />
    </div>
  );
};

export default SettingsCategoriesPage;
