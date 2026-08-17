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
import { LuImage, LuTrash2, LuX } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";
import { productApiService } from "@/features/product/services/product";

export type ProductFormMode = "create" | "edit";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: ProductFormMode;
  defaultValues?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
};

const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
const PRODUCT_IMAGE_INPUT_ID = "product-image-upload";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [removedExistingImage, setRemovedExistingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const stationId = useAppSelector((state) => state.currentStation.stationId);

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
  const previewImageUrl = localPreviewUrl ?? imageUrl;

  const clearLocalPreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setLocalPreviewUrl(null);
  };

  const resetPendingImageSelection = () => {
    clearLocalPreview();
    setPendingImageFile(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!stationId && !data.stationId) {
      return;
    }

    let nextImageUrl = removedExistingImage ? null : data.imageUrl || undefined;

    if (pendingImageFile) {
      setUploadingImage(true);
      setImageError(null);
      try {
        nextImageUrl =
          await productApiService.uploadProductImage(pendingImageFile);
        setValue("imageUrl", nextImageUrl, { shouldDirty: true });
        setRemovedExistingImage(false);
        resetPendingImageSelection();
      } catch {
        setImageError(t("settings.products.imageUploadFailed"));
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    const payload: ProductFormData = {
      ...data,
      stationId: data.stationId || stationId || "",
      price: Number(data.price) || 0,
      cost:
        data.cost === undefined ||
        data.cost === null ||
        Number.isNaN(Number(data.cost))
          ? undefined
          : Number(data.cost),
      isActive: data.isActive ?? true,
      isBestSeller: data.isBestSeller ?? false,
      imageUrl: nextImageUrl,
    };

    onSubmitProp(payload);
    setImageError(null);
  };

  const handleClose = () => {
    setImageError(null);
    resetPendingImageSelection();
    setRemovedExistingImage(false);
    onClose();
  };

  const handleImagePick = async (
    e: React.ChangeEvent<HTMLInputElement>,
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

    setImageError(null);
    resetPendingImageSelection();
    setRemovedExistingImage(false);
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setLocalPreviewUrl(previewUrl);
    setPendingImageFile(file);
  };

  const handleImageRemove = () => {
    setRemovedExistingImage(true);
    resetPendingImageSelection();
    setValue("imageUrl", undefined, { shouldDirty: true });
    setImageError(null);
  };

  // Reset form whenever dialog opens with fresh defaults
  useEffect(() => {
    if (open) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setLocalPreviewUrl(null);
      setPendingImageFile(null);
      setRemovedExistingImage(false);
      setUploadingImage(false);
      reset({
        ...emptyDefaults,
        stationId: stationId ?? "",
        ...defaultValues,
      });
      setImageError(null);
    }
  }, [open, defaultValues, stationId, reset]);

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    [],
  );

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
  const submitLabel = uploadingImage
    ? t("settings.products.imageUploading")
    : mode === "edit"
      ? isSubmitting
        ? t("settings.products.saving")
        : t("settings.products.save")
      : isSubmitting
        ? t("settings.products.creating")
        : t("settings.products.create");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="w-[min(92vw,64rem)] max-w-4xl"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("common.close")}
            title={t("common.close")}
            onClick={handleClose}
            className="-mr-2 -mt-1"
          >
            <LuX className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-5">
            <Controller
              name="imageUrl"
              control={control}
              render={() => (
                <div className="space-y-2">
                  <label className="text-label font-medium text-text-primary">
                    {t("settings.products.image")}
                  </label>

                  <input
                    id={PRODUCT_IMAGE_INPUT_ID}
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImagePick}
                  />

                  {previewImageUrl ? (
                    <InsetPanel className="space-y-4" padding="md">
                      <div className="overflow-hidden rounded-md bg-surface-muted">
                        <img
                          src={previewImageUrl}
                          alt="Product preview"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-label text-text-secondary">
                          {t("settings.products.imageHint")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <label htmlFor={PRODUCT_IMAGE_INPUT_ID}>
                            <Button
                              type="button"
                              variant="secondary"
                              disabled={uploadingImage}
                            >
                              {t("settings.products.imageReplace")}
                            </Button>
                          </label>
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={uploadingImage}
                            onClick={handleImageRemove}
                          >
                            <LuTrash2 className="w-4 h-4" />
                            {t("settings.products.imageRemove")}
                          </Button>
                        </div>
                      </div>
                    </InsetPanel>
                  ) : (
                    <label htmlFor={PRODUCT_IMAGE_INPUT_ID} className="block">
                      <InsetPanel
                        variant="dashed"
                        padding="lg"
                        className="flex min-h-72 w-full cursor-pointer flex-col items-center justify-center gap-3 text-center"
                      >
                        <LuImage className="h-10 w-10" />
                        <span className="text-body font-medium">
                          {uploadingImage
                            ? t("settings.products.imageUploading")
                            : t("settings.products.imageUpload")}
                        </span>
                        <span className="max-w-sm text-label text-text-secondary">
                          {t("settings.products.imageHint")}
                        </span>
                      </InsetPanel>
                    </label>
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
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
              name="isActive"
              control={control}
              render={({ field }) => (
                <InsetPanel className="flex items-center justify-between gap-4">
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
                <InsetPanel className="flex items-center justify-between gap-4">
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
        </div>

        <DialogFooter className="mt-8 border-t border-border pt-5">
          <Button type="button" variant="secondary" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImage || !stationId}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddUpProductForm;
