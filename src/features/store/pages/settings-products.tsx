import { useNavigate, useParams } from "react-router-dom";
import ProductListTemplate from "@/features/product/components/food-list";
import { LuArrowLeft } from "react-icons/lu";

const SettingsProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/store/${id}/settings`)}
        className="min-h-11 px-2 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      >
        <LuArrowLeft size={16} />
        Back to Settings
      </button>

      <ProductListTemplate />
    </div>
  );
};

export default SettingsProductsPage;
