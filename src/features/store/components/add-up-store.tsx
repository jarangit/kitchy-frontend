import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { StoreFormData } from "@/features/store/types/store.model";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/use-translation";

type Props = {
  onSubmit?: (data: StoreFormData) => void;
  defaultValues?: StoreFormData;
};

const AddUpStoreForm = ({ onSubmit, defaultValues }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StoreFormData>();

  const handleFormSubmit = (data: StoreFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      // Set default values if provided
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="name"
        type="text"
        label={t("storeForm.name")}
        error={errors.name?.message}
        {...register("name", { required: t("storeForm.nameRequired") })}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? t("storeForm.saving") : t("storeForm.save")}
      </Button>
    </form>
  );
};

export default AddUpStoreForm;
