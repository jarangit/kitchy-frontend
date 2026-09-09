import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft, LuPlus, LuShapes } from "react-icons/lu";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { CategoryTable } from "@/features/category/components/category-table";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { SearchInput } from "@/shared/components/ui/search-input";
import { DropdownSelect } from "@/shared/components/ui/dropdown-select";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import {
  DataTablePagination,
  type SortingState,
} from "@/shared/components/ui/data-table";

type StatusFilter = "all" | "active" | "inactive";

const CATEGORY_PAGE_SIZE = 10;

const SettingsCategoriesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = useStoreRouteParam();
  const {
    categoriesQuery,
    categoriesQueryLoading,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryService();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "sortOrder", desc: false },
  ]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageIndex, setPageIndex] = useState(0);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categoriesQuery.filter((category) => {
      if (q && !category.name.toLowerCase().includes(q)) return false;
      if (statusFilter === "active" && !category.isActive) return false;
      if (statusFilter === "inactive" && category.isActive) return false;
      return true;
    });
  }, [categoriesQuery, search, statusFilter]);

  const totalFilteredCategories = filteredCategories.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredCategories / CATEGORY_PAGE_SIZE),
  );
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const paginatedCategories = useMemo(() => {
    const start = safePageIndex * CATEGORY_PAGE_SIZE;
    return filteredCategories.slice(start, start + CATEGORY_PAGE_SIZE);
  }, [filteredCategories, safePageIndex]);

  useEffect(() => {
    setPageIndex(0);
  }, [search, statusFilter]);

  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(totalPages - 1);
    }
  }, [pageIndex, totalPages]);

  const handlePageChange = (nextPageIndex: number) => {
    setPageIndex(Math.max(0, Math.min(nextPageIndex, totalPages - 1)));
  };

  const hasActiveFilters = search.trim().length > 0 || statusFilter !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const openCreate = () => {
    navigate(`/store/${resolvedStoreId}/settings/categories/new`);
  };

  const openEdit = (id: string) => {
    navigate(`/store/${resolvedStoreId}/settings/categories/${id}`);
  };

  const handleToggleActive = (id: string, next: boolean) => {
    updateCategoryMutation.mutate({ categoryId: id, data: { isActive: next } });
  };

  const handleDelete = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  const togglingId =
    updateCategoryMutation.isPending && updateCategoryMutation.variables
      ? updateCategoryMutation.variables.categoryId
      : null;

  const statusOptions = [
    { value: "all", label: t("settings.categories.filterStatusAll") },
    { value: "active", label: t("settings.categories.filterStatusActive") },
    {
      value: "inactive",
      label: t("settings.categories.filterStatusInactive"),
    },
  ];

  const showingCount = t("settings.categories.showingCount", {
    shown: totalFilteredCategories,
    total: categoriesQuery.length,
  });

  return (
    <SettingsFrame>
      <div className="w-full space-y-6 lg:space-y-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/store/${resolvedStoreId}/settings`)}
          className="px-1 text-text-secondary hover:text-text-primary"
        >
          <LuArrowLeft size={16} />
          {t("common.backToSettings")}
        </Button>

        <Card as="section">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="min-w-0 flex-1 text-heading leading-tight text-text-primary sm:text-display">
              {t("settings.categories.title")}
            </h1>
            <Button onClick={openCreate}>
              <LuPlus className="h-4 w-4" />
              {t("settings.categories.addCategory")}
            </Button>
          </div>

          {categoriesQuery.length === 0 && !categoriesQueryLoading ? (
            <EmptyState
              icon={<LuShapes size={32} />}
              title={t("settings.categories.emptyTitle")}
              description={t("settings.categories.emptyDescription")}
            />
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <SearchInput
                    className="sm:flex-1"
                    value={search}
                    onValueChange={setSearch}
                    placeholder={t("settings.categories.searchPlaceholder")}
                  />
                  <DropdownSelect
                    aria-label={t("settings.categories.filterStatus")}
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
                    options={statusOptions}
                    className="sm:min-w-[140px]"
                  />
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
                      {t("settings.categories.clearFilters")}
                    </button>
                  )}
                </div>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="space-y-4">
                  <CategoryTable
                    categories={paginatedCategories}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    togglingId={togglingId}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                    isLoading={categoriesQueryLoading}
                  />
                  <DataTablePagination
                    pageIndex={safePageIndex}
                    pageSize={CATEGORY_PAGE_SIZE}
                    totalItems={totalFilteredCategories}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <EmptyState
                  icon={<LuShapes size={32} />}
                  title={t("settings.categories.noResults")}
                  description={t("settings.categories.noResultsDescription")}
                  action={
                    hasActiveFilters ? (
                      <Button variant="secondary" onClick={handleClearFilters}>
                        {t("settings.categories.clearFilters")}
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </SettingsFrame>
  );
};

export default SettingsCategoriesPage;
