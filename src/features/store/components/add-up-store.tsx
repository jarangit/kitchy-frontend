import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { StoreFormData } from "@/features/store/types/store.model";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/use-translation";

type Props = {
  _onSubmit?: (data: StoreFormData) => void;
  defaultValues?: StoreFormData;
};

const AddUpStoreForm = ({ _onSubmit, defaultValues }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StoreFormData>();

  const onSubmit = (data: StoreFormData) => {
    if (_onSubmit) {
      _onSubmit(data);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      // Set default values if provided
      reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
