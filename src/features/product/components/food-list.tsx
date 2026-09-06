import { useEffect, useMemo, useState } from "react";
import { LuPackage } from "react-icons/lu";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import AddUpProductForm from "@/features/product/components/add-up-product";
import type { ProductFormMode } from "@/features/product/components/add-up-product";
import { ProductTable } from "@/features/product/components/product-table";
import {
  DataTablePagination,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Button } from "@/shared/components/ui/button";
import { SearchInput } from "@/shared/components/ui/search-input";
import { DropdownSelect } from "@/shared/components/ui/dropdown-select";
import { useTranslation } from "@/shared/i18n/use-translation";
import type {
  IMenu,
  ProductFormData,
} from "@/features/product/types/product.model";

type StatusFilter = "all" | "active" | "inactive";

const ALL_CATEGORY = "__all__";

const PRODUCT_PAGE_SIZE = 10;

export interface ProductListActions {
  openCreate: () => void;
}

interface ProductListTemplateProps {
  /** Lets a parent (e.g. page header action) trigger the create dialog. */
  actionsRef?: { current: ProductListActions | null };
}

const ProductListTemplate = ({ actionsRef }: ProductListTemplateProps) => {
  const { t } = useTranslation();
  const {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductService();
  const { categoriesQuery } = useCategoryService();

  const products = useMemo(
    () => (productsQuery ?? []) as IMenu[],
    [productsQuery],
  );

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
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = PRODUCT_PAGE_SIZE;

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

  const totalFilteredProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredProducts / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const paginatedProducts = useMemo(() => {
    const start = safePageIndex * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, pageSize, safePageIndex]);

  useEffect(() => {
    setPageIndex(0);
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(totalPages - 1);
    }
  }, [pageIndex, totalPages]);

  const handlePageChange = (nextPageIndex: number) => {
    setPageIndex(Math.max(0, Math.min(nextPageIndex, totalPages - 1)));
  };

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

  useEffect(() => {
    if (actionsRef) actionsRef.current = { openCreate };
  });

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
        isBestSeller: editingProduct.isBestSeller,
        imageUrl: editingProduct.imageUrl,
      }
    : undefined;

  const statusOptions = [
    { value: "all", label: t("settings.products.filterStatusAll") },
    { value: "active", label: t("settings.products.filterStatusActive") },
    { value: "inactive", label: t("settings.products.filterStatusInactive") },
  ];
  const categoryOptions = [
    { value: ALL_CATEGORY, label: t("settings.products.filterCategoryAll") },
    ...categoriesQuery.map((category) => ({
      value: category.id,
      label: category.name,
    })),
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
              <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row sm:items-center">
                <DropdownSelect
                  aria-label={t("settings.products.filterStatus")}
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                  options={statusOptions}
                  className="sm:min-w-[140px]"
                />
                {categoriesQuery.length > 0 && (
                  <DropdownSelect
                    aria-label={t("settings.products.filterCategory")}
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    options={categoryOptions}
                    className="sm:min-w-[160px]"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-label text-text-secondary">
                {showingCount}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-label text-text-primary hover:text-accent-text hover:underline"
                >
                  {t("settings.products.clearFilters")}
                </button>
              )}
            </div>
          </div>

          {/* Results: single table-based layout on all screen sizes */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              <ProductTable
                products={paginatedProducts}
                sorting={sorting}
                onSortingChange={setSorting}
                togglingId={togglingId}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
              <DataTablePagination
                pageIndex={safePageIndex}
                pageSize={pageSize}
                totalItems={totalFilteredProducts}
                onPageChange={handlePageChange}
              />
            </div>
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
