import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { OrderFormData } from "@/features/order/types/order.model";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

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
      <Input
        id="name"
        type="text"
        label="Order number"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Order"}
      </Button>
    </form>
  );
};

export default AddUpOrderForm;
