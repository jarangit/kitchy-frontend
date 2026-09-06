import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import ProductListTemplate, {
  type ProductListActions,
} from "@/features/product/components/food-list";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";

const SettingsProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const listActionsRef = useRef<ProductListActions | null>(null);

  return (
    <SettingsFrame>
      <div className="w-full space-y-6 lg:space-y-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/store/${id}/settings`)}
          className="px-1 text-text-secondary hover:text-text-primary"
        >
          <LuArrowLeft size={16} />
          {t("common.backToSettings")}
        </Button>

        <Card as="section">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="min-w-0 flex-1 text-heading leading-tight text-text-primary sm:text-display">
              {t("settings.products.title")}
            </h1>
            <Button onClick={() => listActionsRef.current?.openCreate()}>
              <LuPlus className="h-4 w-4" />
              {t("settings.products.addProduct")}
            </Button>
          </div>
          <ProductListTemplate actionsRef={listActionsRef} />
        </Card>
      </div>
    </SettingsFrame>
  );
};

export default SettingsProductsPage;
