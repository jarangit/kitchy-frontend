import { useNavigate, useParams } from "react-router-dom";
import AddUpProductForm from "@/features/product/components/add-up-product";
import { useProductService } from "@/features/product/hooks/useProductService";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { ProductFormData } from "@/features/product/types/product.model";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id, productId } = useParams<{ id: string; productId?: string }>();
  const { t } = useTranslation();
  const isNew = !productId;
  const {
    productDetailQuery,
    productDetailLoading,
    createProductMutation,
    updateProductMutation,
  } = useProductService(productId);
  const listPath = `/store/${id}/settings/products`;

  const defaults = productDetailQuery
    ? {
        name: productDetailQuery.name,
        stationId: productDetailQuery.stationId ?? "",
        categoryId: productDetailQuery.categoryId,
        price: productDetailQuery.price ?? 0,
        cost: productDetailQuery.cost,
        isActive: productDetailQuery.isActive,
        isBestSeller: productDetailQuery.isBestSeller,
        imageUrl: productDetailQuery.imageUrl,
      }
    : undefined;

  const handleSubmit = (data: ProductFormData) => {
    if (productId) {
      updateProductMutation.mutate(
        { productId, data },
        { onSuccess: () => navigate(listPath) },
      );
    } else {
      createProductMutation.mutate(data, {
        onSuccess: () => navigate(listPath),
      });
    }
  };

  return (
    <SettingsFrame>
      {productDetailLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !isNew && !productDetailQuery ? (
        <EmptyState
          title={t("settings.products.noProductsTitle")}
          description={t("settings.products.noProductsDescription")}
        />
      ) : (
        <AddUpProductForm
          open
          page
          mode={isNew ? "create" : "edit"}
          defaultValues={defaults}
          onClose={() => navigate(listPath)}
          onSubmit={handleSubmit}
        />
      )}
    </SettingsFrame>
  );
};

export default ProductDetailPage;
