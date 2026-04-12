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
    // Handle form submission
    console.log(data);
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
          className="border p-2 w-full rounded"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default AddUpOrderForm;
