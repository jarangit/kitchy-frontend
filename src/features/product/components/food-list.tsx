import { useMemo, useState } from "react";
import { LuPackage, LuPlus } from "react-icons/lu";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import AddUpProductForm from "@/features/product/components/add-up-product";
import type { ProductFormMode } from "@/features/product/components/add-up-product";
import { ProductCard } from "@/features/product/components/product-card";
import { ProductTable } from "@/features/product/components/product-table";
import type { SortingState } from "@/shared/components/ui/data-table";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Button } from "@/shared/components/ui/button";
import { SearchInput } from "@/shared/components/ui/search-input";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { SettingsSectionCard } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { IMenu, ProductFormData } from "@/features/product/types/product.model";

type StatusFilter = "all" | "active" | "inactive";

const ALL_CATEGORY = "__all__";

const ProductListTemplate = () => {
  const { t } = useTranslation();
  const {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductService();
  const { categoriesQuery } = useCategoryService();

  const products = useMemo(() => (productsQuery ?? []) as IMenu[], [productsQuery]);

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ProductFormMode>("create");
  const [editingProduct, setEditingProduct] = useState<IMenu | null>(null);

  // Toolbar state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORY);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "inactive" && p.isActive) return false;
      if (categoryFilter !== ALL_CATEGORY) {
        if ((p.categoryId ?? "") !== categoryFilter) return false;
      }
      return true;
    });

    const sort = sorting[0];
    if (!sort) return list;
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sort.id) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = (a.price ?? 0) - (b.price ?? 0);
          break;
        case "cost":
          cmp = (a.cost ?? 0) - (b.cost ?? 0);
          break;
        default: {
          const aT = new Date(a.createdAt).getTime();
          const bT = new Date(b.createdAt).getTime();
          cmp = aT - bT;
          break;
        }
      }
      return sort.desc ? -cmp : cmp;
    });
    return sorted;
  }, [products, search, statusFilter, categoryFilter, sorting]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== ALL_CATEGORY;

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter(ALL_CATEGORY);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setEditingProduct(product);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (data: ProductFormData) => {
    if (formMode === "edit" && editingProduct) {
      updateProductMutation.mutate(
        { productId: editingProduct.id, data },
        { onSuccess: () => handleCloseForm() },
      );
      return;
    }
    createProductMutation.mutate(data, {
      onSuccess: () => handleCloseForm(),
    });
  };

  const handleToggleActive = (id: string, next: boolean) => {
    updateProductMutation.mutate({ productId: id, data: { isActive: next } });
  };

  const handleDelete = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const editingDefaults: ProductFormData | undefined = editingProduct
    ? {
        name: editingProduct.name,
        stationId: editingProduct.stationId ?? "",
        categoryId: editingProduct.categoryId,
        price: editingProduct.price ?? 0,
        cost: editingProduct.cost,
        isActive: editingProduct.isActive,
        imageUrl: editingProduct.imageUrl,
      }
    : undefined;

  const statusItems: { key: StatusFilter; label: string }[] = [
    { key: "all", label: t("settings.products.filterStatusAll") },
    { key: "active", label: t("settings.products.filterStatusActive") },
    { key: "inactive", label: t("settings.products.filterStatusInactive") },
  ];

  const showingCount = t("settings.products.showingCount", {
    shown: filteredProducts.length,
    total: products.length,
  });

  const togglingId =
    updateProductMutation.isPending && updateProductMutation.variables
      ? updateProductMutation.variables.productId
      : null;

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title={t("settings.products.listTitle")}
        description={t("settings.products.listDescription")}
        action={
          <Button onClick={openCreate}>
            <LuPlus className="h-4 w-4" />
            {t("settings.products.addProduct")}
          </Button>
        }
      >
        {products.length === 0 ? (
          <EmptyState
            icon={<LuPackage size={32} />}
            title={t("settings.products.noProductsTitle")}
            description={t("settings.products.noProductsDescription")}
          />
        ) : (
          <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchInput
                  className="sm:flex-1"
                  value={search}
                  onValueChange={setSearch}
                  placeholder={t("settings.products.searchPlaceholder")}
                />
                <Tabs
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as StatusFilter)}
                  variant="segmented"
                >
                  <TabList>
                    {statusItems.map((item) => (
                      <Tab key={item.key} value={item.key}>
                        {item.label}
                      </Tab>
                    ))}
                  </TabList>
                </Tabs>
              </div>

              {/* Category chips */}
              {categoriesQuery.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <ChipTab
                    size="sm"
                    active={categoryFilter === ALL_CATEGORY}
                    onClick={() => setCategoryFilter(ALL_CATEGORY)}
                  >
                    {t("settings.products.filterCategoryAll")}
                  </ChipTab>
                  {categoriesQuery.map((category) => (
                    <ChipTab
                      key={category.id}
                      size="sm"
                      active={categoryFilter === category.id}
                      onClick={() => setCategoryFilter(category.id)}
                    >
                      {category.name}
                    </ChipTab>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-label text-text-secondary">
                  {showingCount}
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-label text-accent hover:underline"
                  >
                    {t("settings.products.clearFilters")}
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            {filteredProducts.length > 0 ? (
              <>
                {/* Desktop: table */}
                <div className="hidden md:block">
                  <ProductTable
                    products={filteredProducts}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    togglingId={togglingId}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                  />
                </div>

                {/* Mobile: cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
                  {filteredProducts.map((menu) => (
                    <ProductCard
                      key={menu.id}
                      id={menu.id}
                      name={menu.name}
                      isActive={menu.isActive}
                      price={menu.price}
                      cost={menu.cost}
                      imageUrl={menu.imageUrl}
                      categoryName={menu.categoryName}
                      stationName={menu.stationName}
                      isToggling={togglingId === menu.id}
                      onToggleActive={handleToggleActive}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={<LuPackage size={32} />}
                title={t("settings.products.noResults")}
                description={t("settings.products.noResultsDescription")}
                action={
                  hasActiveFilters ? (
                    <Button variant="secondary" onClick={handleClearFilters}>
                      {t("settings.products.clearFilters")}
                    </Button>
                  ) : undefined
                }
              />
            )}
          </div>
        )}
      </SettingsSectionCard>

      <AddUpProductForm
        open={isFormOpen}
        onClose={handleCloseForm}
        mode={formMode}
        defaultValues={editingDefaults}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductListTemplate;
