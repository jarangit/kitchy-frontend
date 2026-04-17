import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { MenuFormData } from "@/features/product/types/product.model";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

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
      <Input
        id="name"
        type="text"
        label="Menu Name"
        placeholder="Enter menu name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Menu"}
      </Button>
    </form>
  );
};

export default AddUpMenuForm;
