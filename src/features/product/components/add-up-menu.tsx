import  { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { MenuFormData } from "@/features/product/types/product.model";

type Props = {
  _onSubmit?: (data: MenuFormData) => void;
  defaultValues?: MenuFormData;
};

const AddUpMenuForm = ({ _onSubmit, defaultValues }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MenuFormData>();

  const onSubmit = (data: MenuFormData) => {
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
        <label htmlFor="name" className="block font-[var(--weight-medium)] mb-1">
          Menu Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
          className="border border-[var(--color-border)] p-3 w-full rounded-[var(--input-radius)] bg-[var(--input-bg)] text-[var(--input-text)]"
          placeholder="Enter menu name"
        />
        {errors.name && (
          <span className="text-[var(--color-danger)] text-label">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] px-4 py-2 rounded-radius-xs h-11 active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      >
        {isSubmitting ? "Saving..." : "Save Menu"}
      </button>
    </form>
  );
};

export default AddUpMenuForm;
