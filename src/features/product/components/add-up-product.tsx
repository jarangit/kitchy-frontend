import { useEffect, useRef, useState } from "react";
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
import { Toggle } from "@/shared/components/ui/toggle";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { useAppSelector } from "@/shared/hooks/hooks";
import { LuImage, LuTrash2 } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";

export type ProductFormMode = "create" | "edit";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: ProductFormMode;
  defaultValues?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const emptyDefaults: ProductFormData = {
  name: "",
  stationId: "",
  categoryId: undefined,
  price: 0,
  cost: undefined,
  isActive: true,
  isBestSeller: false,
  imageUrl: undefined,
};

const AddUpProductForm = ({
  open,
  onClose,
  mode = "create",
  defaultValues,
  onSubmit: onSubmitProp,
}: Props) => {
  const { t } = useTranslation();
  const [optionCategory, setOptionCategory] = useState<
    { value: string; label: string }[]
  >([]);
  const { categoriesQuery } = useCategoryService();
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stationId = useAppSelector(
    (state) => state.currentStation.stationId
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      ...emptyDefaults,
      stationId: stationId ?? "",
      ...defaultValues,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = (data: ProductFormData) => {
    if (!stationId && !data.stationId) {
      return;
    }

    const payload: ProductFormData = {
      ...data,
      stationId: data.stationId || stationId || "",
      price: Number(data.price) || 0,
      cost:
        data.cost === undefined || data.cost === null || Number.isNaN(Number(data.cost))
          ? undefined
          : Number(data.cost),
      isActive: data.isActive ?? true,
      isBestSeller: data.isBestSeller ?? false,
      imageUrl: data.imageUrl || undefined,
    };

    onSubmitProp(payload);
    setImageError(null);
  };

  const handleClose = () => {
    setImageError(null);
    onClose();
  };

  const handleImagePick = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError(t("settings.products.imageInvalidType"));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(t("settings.products.imageTooLarge"));
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setValue("imageUrl", dataUrl, { shouldDirty: true });
      setImageError(null);
    } catch {
      setImageError(t("settings.products.imageInvalidType"));
    }
  };

  const handleImageRemove = () => {
    setValue("imageUrl", undefined, { shouldDirty: true });
    setImageError(null);
  };

  // Reset form whenever dialog opens with fresh defaults
  useEffect(() => {
    if (open) {
      reset({
        ...emptyDefaults,
        stationId: stationId ?? "",
        ...defaultValues,
      });
      setImageError(null);
    }
  }, [open, defaultValues, stationId, reset]);

  useEffect(() => {
    if (categoriesQuery && categoriesQuery.length > 0) {
      const options = categoriesQuery.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setOptionCategory(options);
    } else {
      setOptionCategory([]);
    }
  }, [categoriesQuery]);

  useEffect(() => {
    if (stationId) {
      setValue("stationId", stationId);
    }
  }, [stationId, setValue]);

  const title =
    mode === "edit"
      ? t("settings.products.editTitle")
      : t("settings.products.createTitle");
  const description =
    mode === "edit"
      ? t("settings.products.editDescription")
      : t("settings.products.createDescription");
  const submitLabel =
    mode === "edit"
      ? isSubmitting
        ? t("settings.products.saving")
        : t("settings.products.save")
      : isSubmitting
      ? t("settings.products.creating")
      : t("settings.products.create");

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image uploader */}
          <Controller
            name="imageUrl"
            control={control}
            render={() => (
              <div className="space-y-2">
                <label className="text-label font-medium text-text-primary">
                  {t("settings.products.image")}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />

                {imageUrl ? (
                  <InsetPanel className="flex items-center gap-4" padding="sm">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="h-20 w-20 rounded-sm object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <span className="text-label text-text-secondary">
                        {t("settings.products.imageHint")}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {t("settings.products.imageReplace")}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleImageRemove}
                        >
                          <LuTrash2 className="w-4 h-4" />
                          {t("settings.products.imageRemove")}
                        </Button>
                      </div>
                    </div>
                  </InsetPanel>
                ) : (
                  <InsetPanel
                    as="button"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="dashed"
                    padding="lg"
                    className="flex w-full flex-col items-center justify-center gap-2"
                  >
                    <LuImage className="h-8 w-8" />
                    <span className="text-body font-medium">
                      {t("settings.products.imageUpload")}
                    </span>
                    <span className="text-label">
                      {t("settings.products.imageHint")}
                    </span>
                  </InsetPanel>
                )}

                {imageError && (
                  <p className="text-danger text-label">{imageError}</p>
                )}
              </div>
            )}
          />

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              label={t("settings.products.price")}
              placeholder={t("settings.products.pricePlaceholder")}
              error={errors.price?.message}
              {...register("price", {
                required: t("settings.products.priceRequired"),
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: t("settings.products.priceMin"),
                },
              })}
            />

            <Input
              id="product-cost"
              type="number"
              step="0.01"
              min="0"
              label={`${t("settings.products.cost")} (${t("settings.products.costOptional")})`}
              placeholder={t("settings.products.costPlaceholder")}
              error={errors.cost?.message}
              {...register("cost", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: t("settings.products.costMin"),
                },
              })}
            />
          </div>

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                id="product-category"
                label={t("settings.products.category")}
                options={optionCategory}
                placeholder={t("settings.products.categoryPlaceholder")}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <InsetPanel className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-body font-medium text-text-primary">
                    {t("settings.products.isActive")}
                  </span>
                  <span className="text-label text-text-secondary">
                    {t("settings.products.isActiveDescription")}
                  </span>
                </div>
                <Toggle
                  checked={field.value ?? true}
                  onChange={(v) => field.onChange(v)}
                  label={t("settings.products.isActive")}
                />
              </InsetPanel>
            )}
          />

          <Controller
            name="isBestSeller"
            control={control}
            render={({ field }) => (
              <InsetPanel className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-body font-medium text-text-primary">
                    {t("settings.products.isBestSeller")}
                  </span>
                  <span className="text-label text-text-secondary">
                    {t("settings.products.isBestSellerDescription")}
                  </span>
                </div>
                <Toggle
                  checked={field.value ?? false}
                  onChange={(v) => field.onChange(v)}
                  label={t("settings.products.isBestSeller")}
                />
              </InsetPanel>
            )}
          />

          {!stationId && (
            <p className="text-danger text-label">
              {t("settings.products.stationMissing")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting || !stationId}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddUpProductForm;
