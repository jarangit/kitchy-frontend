import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuTrash2 } from "react-icons/lu";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Toggle } from "@/shared/components/ui/toggle";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { toast } from "@/shared/services/toast-service";
import type { CategoryFormData } from "@/features/category/components/add-up-category";

const emptyDefaults: CategoryFormData = {
  name: "",
  sortOrder: 0,
  isActive: true,
};
const FORM_ID = "category-form";

const CategoryDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const storeId = useStoreRouteParam();
  const isNew = !categoryId;
  const listPath = `/store/${storeId}/settings/categories`;
  const {
    categoriesQuery,
    categoriesQueryLoading,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryService();
  const category = categoriesQuery.find((item) => item.id === categoryId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({ defaultValues: emptyDefaults });

  useEffect(() => {
    if (category)
      reset({
        name: category.name,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      });
  }, [category, reset]);

  const onSubmit = (data: CategoryFormData) => {
    const cleanData = {
      name: data.name.trim(),
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive ?? true,
    };
    if (isNew) {
      createCategoryMutation.mutate(cleanData, {
        onSuccess: () => navigate(listPath),
      });
    } else if (categoryId) {
      updateCategoryMutation.mutate(
        { categoryId, data: cleanData },
        {
          onSuccess: () =>
            toast.success({ title: t("settings.categories.save") }),
        },
      );
    }
  };

  const handleDelete = () => {
    if (!categoryId) return;
    deleteCategoryMutation.mutate(categoryId, {
      onSuccess: () => {
        setConfirmingDelete(false);
        navigate(listPath);
      },
    });
  };

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <SettingsFrame>
      <div className="w-full space-y-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(listPath)}
          className="px-1 text-text-secondary hover:text-text-primary"
        >
          <LuArrowLeft size={16} />
          {t("settings.categories.title")}
        </Button>
        <div>
          <h1 className="text-heading leading-tight text-text-primary sm:text-display">
            {isNew
              ? t("settings.categories.createTitle.category")
              : t("settings.categories.editTitle")}
          </h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            {isNew
              ? t("settings.categories.createDescription.category")
              : t("settings.categories.editDescription")}
          </p>
        </div>
        {isNew || category ? (
          <form
            id={FORM_ID}
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl space-y-6"
          >
            <Input
              id="category-name"
              label={t("settings.categories.categoryName")}
              placeholder={t("settings.categories.categoryNamePlaceholder")}
              error={errors.name?.message}
              {...register("name", {
                required: t("settings.categories.categoryNameRequired"),
                minLength: {
                  value: 2,
                  message: t("settings.categories.categoryNameMin"),
                },
              })}
            />
            <Input
              id="category-sort-order"
              type="number"
              label={t("settings.categories.sortOrder")}
              placeholder="0"
              error={errors.sortOrder?.message}
              {...register("sortOrder", { valueAsNumber: true })}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <InsetPanel className="flex items-center justify-between">
                  <div>
                    <span className="text-body font-medium text-text-primary">
                      {t("settings.categories.isActive")}
                    </span>
                    <p className="text-label text-text-secondary">
                      {t("settings.categories.isActiveDescription")}
                    </p>
                  </div>
                  <Toggle
                    checked={field.value ?? true}
                    onChange={field.onChange}
                    label={t("settings.categories.isActive")}
                  />
                </InsetPanel>
              )}
            />
          </form>
        ) : categoriesQueryLoading ? (
          <p className="text-body-sm text-text-secondary">Loading...</p>
        ) : (
          <EmptyState
            title={t("settings.categories.editTitle")}
            description={t("settings.categories.noResultsDescription")}
            action={
              <Button variant="secondary" onClick={() => navigate(listPath)}>
                {t("settings.categories.title")}
              </Button>
            }
          />
        )}
        {(isNew || category) && (
          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-bg py-4">
            {!isNew ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmingDelete(true)}
                className="text-danger hover:bg-danger-bg hover:text-danger"
              >
                <LuTrash2 className="h-4 w-4" />
                {t("common.delete")}
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(listPath)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
                {isNew
                  ? t("settings.categories.create.category")
                  : t("settings.categories.save")}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
      >
        <DialogHeader>
          <DialogTitle>{t("common.delete")}</DialogTitle>
          <DialogDescription>{category?.name}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setConfirmingDelete(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            disabled={deleteCategoryMutation.isPending}
            onClick={handleDelete}
          >
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </Dialog>
    </SettingsFrame>
  );
};

export default CategoryDetailPage;
