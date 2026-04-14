import { useNavigate, useParams } from "react-router-dom";
import ProductListTemplate from "@/features/product/components/food-list";
import { SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";

const SettingsProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <SettingsShell
      title={t("settings.products.title")}
      description={t("settings.products.description")}
      onBack={() => navigate(`/store/${id}/settings`)}
    >
      <ProductListTemplate />
    </SettingsShell>
  );
};

export default SettingsProductsPage;
