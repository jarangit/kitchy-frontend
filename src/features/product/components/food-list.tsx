/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProductService } from "@/features/product/hooks/useProductService";
import AddUpProductForm from "@/features/product/components/add-up-product";
import { ProductCard } from "@/features/product/components/product-card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { LuPackage } from "react-icons/lu";
import { SettingsSectionCard } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";

const ProductListTemplate = () => {
  const { t } = useTranslation();
  const {
    productsQuery,
    createMenuMutation: createProductMutation,
    deleteMenuMutation: deleteProductMutation,
  } = useProductService();

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title={t("settings.products.listTitle")}
        description={t("settings.products.listDescription")}
      >
        {productsQuery && productsQuery.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsQuery.map((menu: any) => (
              <ProductCard
                key={menu.id}
                id={menu.id}
                name={menu.name}
                isActive={menu.isActive}
                onDelete={(itemId: string) => {
                  deleteProductMutation.mutate(itemId);
                }}
                showAddButton={menu.showAddButton}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<LuPackage size={32} />}
            title={t("settings.products.noProductsTitle")}
            description={t("settings.products.noProductsDescription")}
          />
        )}
      </SettingsSectionCard>

      <AddUpProductForm
        _onSubmit={(data) => {
          createProductMutation.mutate({
            ...data,
          });
        }}
      />
    </div>
  );
};

export default ProductListTemplate;
