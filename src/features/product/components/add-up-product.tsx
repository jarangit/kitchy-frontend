import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { ProductFormData } from "@/features/product/types/product.model";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { useStationService } from "@/features/station/hooks/useStation";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { LuPlus } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";

type Props = {
  _onSubmit?: (data: ProductFormData) => void;
  defaultValues?: ProductFormData;
};

const AddUpProductForm = ({ _onSubmit, defaultValues }: Props) => {
  const { t } = useTranslation();
  const [optionStation, setOptionStation] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionCategory, setOptionCategory] = useState<
    { value: string; label: string }[]
  >([]);
  const { stationsQuery } = useStationService({});
  const { categoriesQuery } = useCategoryService();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      stationId: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (_onSubmit) {
      _onSubmit(data);
    }

    // Reset form and close dialog after successful submission
    reset();
    setIsCreateDialogOpen(false);
  };

  const onCreateOptionStation = () => {
    if (stationsQuery && stationsQuery.length > 0) {
      const options = stationsQuery.map(
        (station: { id: string; name: string }) => ({
          value: station.id,
          label: station.name,
        })
      );
      setOptionStation(options);
    }
  };

  const onCreateOptionCategory = () => {
    if (categoriesQuery && categoriesQuery.length > 0) {
      const options = categoriesQuery.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setOptionCategory(options);
    } else {
      setOptionCategory([]);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
    onCreateOptionStation();
    onCreateOptionCategory();
  }, [defaultValues, reset, stationsQuery, categoriesQuery]);

  return (
    <>
      <Button
        variant="primary"
        className="absolute top-4 right-4"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <LuPlus className="w-4 h-4" />
        {t("settings.products.addProduct")}
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("settings.products.createTitle")}</DialogTitle>
            <DialogDescription>
              {t("settings.products.createDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              id="product-name"
              label={t("settings.products.productName")}
              placeholder={t("settings.products.productNamePlaceholder")}
              error={errors.name?.message}
              {...register("name", {
                required: t("settings.products.productNameRequired"),
                minLength: {
                  value: 2,
                  message: t("settings.products.productNameMin"),
                },
              })}
            />

            <Controller
              name="stationId"
              control={control}
              rules={{ required: t("settings.products.stationRequired") }}
              render={({ field }) => (
                <div>
                  <Select
                    id="product-station"
                    label={t("settings.products.station")}
                    options={optionStation}
                    placeholder={t("settings.products.stationPlaceholder")}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  {errors.stationId && (
                    <p className="text-[var(--color-danger)] text-sm mt-1">
                      {errors.stationId.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  id="product-category"
                  label="Category"
                  options={optionCategory}
                  placeholder="Select a category (optional)"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("settings.products.creating") : t("settings.products.create")}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default AddUpProductForm;
