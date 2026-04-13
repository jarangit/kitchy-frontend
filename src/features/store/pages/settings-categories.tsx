import { useNavigate, useParams } from "react-router-dom";
import StationListTemplate from "@/features/station/components/stattion-list";
import { LuArrowLeft } from "react-icons/lu";

const SettingsCategoriesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/store/${id}/settings`)}
        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors active:scale-[0.98]"
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
