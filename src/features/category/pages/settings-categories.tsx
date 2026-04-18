import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuPlus, LuShapes } from "react-icons/lu";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import AddUpCategoryForm, {
  type CategoryFormData,
  type CategoryFormMode,
} from "@/features/category/components/add-up-category";
import { CategoryTable } from "@/features/category/components/category-table";
import {
  SettingsSectionCard,
  SettingsShell,
} from "@/features/store/components/settings-shell";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { SortingState } from "@/shared/components/ui/data-table";
import type { CategoryModel } from "@/features/category/types/category.model";

const SettingsCategoriesPage = () => {
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = id ?? storeId;
  const {
    categoriesQuery,
    categoriesQueryLoading,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryService();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CategoryFormMode>("create");
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(
    null,
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sortOrder", desc: false },
  ]);

  const openCreate = () => {
    setEditingCategory(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEdit = (id: string) => {
    const category = categoriesQuery.find((c) => c.id === id);
    if (!category) return;
    setEditingCategory(category);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (data: CategoryFormData) => {
    if (formMode === "edit" && editingCategory) {
      updateCategoryMutation.mutate(
        { categoryId: editingCategory.id, data },
        { onSuccess: () => handleClose() },
      );
      return;
    }
    createCategoryMutation.mutate(data, {
      onSuccess: () => handleClose(),
    });
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

  const editingDefaults: CategoryFormData | undefined = editingCategory
    ? {
        name: editingCategory.name,
        sortOrder: editingCategory.sortOrder,
        isActive: editingCategory.isActive,
      }
    : undefined;

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <SettingsShell
      title={t("settings.categories.title")}
      description={t("settings.categories.description")}
      onBack={() => navigate(`/store/${resolvedStoreId}/settings`)}
    >
      <SettingsSectionCard
        title={t("settings.categories.featureTitle")}
        description={t("settings.categories.featureDescription")}
        action={
          <Button onClick={openCreate}>
            <LuPlus className="h-4 w-4" />
            {t("settings.categories.addCategory")}
          </Button>
        }
      >
        {categoriesQuery.length === 0 && !categoriesQueryLoading ? (
          <EmptyState
            icon={<LuShapes size={32} />}
            title={t("settings.categories.emptyTitle")}
            description={t("settings.categories.emptyDescription")}
          />
        ) : (
          <CategoryTable
            categories={categoriesQuery}
            sorting={sorting}
            onSortingChange={setSorting}
            togglingId={togglingId}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            isLoading={categoriesQueryLoading}
          />
        )}
      </SettingsSectionCard>

      <AddUpCategoryForm
        open={isFormOpen}
        onClose={handleClose}
        mode={formMode}
        defaultValues={editingDefaults}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </SettingsShell>
  );
};

export default SettingsCategoriesPage;
