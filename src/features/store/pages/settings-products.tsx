import { useNavigate, useParams } from "react-router-dom";
import ProductListTemplate from "@/features/product/components/food-list";
import { SettingsShell } from "@/features/store/components/settings-shell";

const SettingsProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <SettingsShell
      title="Product Management"
      description="Add, edit, and organize the products available in this store."
      onBack={() => navigate(`/store/${id}/settings`)}
    >
      <ProductListTemplate />
    </SettingsShell>
  );
};

export default SettingsProductsPage;
