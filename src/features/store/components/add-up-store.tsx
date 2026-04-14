import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { StoreFormData } from "@/features/store/types/store.model";
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
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          {t("storeForm.name")}
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: t("storeForm.nameRequired") })}
          className="border border-[var(--color-border)] p-3 w-full rounded-[var(--input-radius)] bg-[var(--input-bg)] text-[var(--input-text)]"
        />
        {errors.name && (
          <span className="text-[var(--color-danger)] text-sm">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] px-4 py-2 rounded h-11 active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      >
        {isSubmitting ? t("storeForm.saving") : t("storeForm.save")}
      </button>
    </form>
  );
};

export default AddUpStoreForm;
