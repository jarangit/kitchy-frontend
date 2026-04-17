import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { OrderFormData } from "@/features/order/types/order.model";

type Props = {
  _onSubmit?: (data: OrderFormData) => void;
  defaultValues?: OrderFormData;
};

const AddUpOrderForm = ({ _onSubmit, defaultValues }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderFormData>();

  const onSubmit = (data: OrderFormData) => {
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
          Order number
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
          className="border border-border p-3 w-full rounded-input bg-input-bg text-input-text"
        />
        {errors.name && (
          <span className="text-danger text-sm">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-button-primary-bg text-button-primary-text hover:bg-button-primary-bg-hover px-4 py-2 rounded-radius-xs h-11  transition-all duration-[var(--motion-fast)]"
      >
        {isSubmitting ? "Saving..." : "Save Order"}
      </button>
    </form>
  );
};

export default AddUpOrderForm;
