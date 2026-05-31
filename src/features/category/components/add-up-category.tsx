import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Toggle } from "@/shared/components/ui/toggle";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";

export type CategoryFormMode = "create" | "edit";

export interface CategoryFormData {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: CategoryFormMode;
  defaultValues?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting?: boolean;
};

const emptyDefaults: CategoryFormData = {
  name: "",
  sortOrder: 0,
  isActive: true,
};

const AddUpCategoryForm = ({
  open,
  onClose,
  mode = "create",
  defaultValues,
  onSubmit: onSubmitProp,
  isSubmitting,
}: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  useEffect(() => {
    if (open) {
      reset({ ...emptyDefaults, ...defaultValues });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: CategoryFormData) => {
    onSubmitProp({
      name: data.name.trim(),
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive ?? true,
    });
  };

  const title =
    mode === "edit"
      ? t("settings.categories.editTitle")
      : t("settings.categories.createTitle.category");
  const description =
    mode === "edit"
      ? t("settings.categories.editDescription")
      : t("settings.categories.createDescription.category");
  const submitLabel =
    mode === "edit"
      ? isSubmitting
        ? t("settings.categories.saving")
        : t("settings.categories.save")
      : isSubmitting
        ? t("settings.categories.creating")
        : t("settings.categories.create.category");

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                <div className="flex flex-col">
                  <span className="text-body font-medium text-text-primary">
                    {t("settings.categories.isActive")}
                  </span>
                  <span className="text-label text-text-secondary">
                    {t("settings.categories.isActiveDescription")}
                  </span>
                </div>
                <Toggle
                  checked={field.value ?? true}
                  onChange={(v) => field.onChange(v)}
                  label={t("settings.categories.isActive")}
                />
              </InsetPanel>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddUpCategoryForm;
