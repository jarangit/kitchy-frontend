import { useEffect, useState } from "react";
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
import { useStationService } from "@/features/station/hooks/useStation";
import { useParams } from "react-router-dom";
import { LuPlus } from "react-icons/lu";

type Props = {
  _onSubmit?: (data: ProductFormData) => void;
  defaultValues?: ProductFormData;
};

const AddUpProductForm = ({ _onSubmit, defaultValues }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [optionStation, setOptionStation] = useState<
    { value: string; label: string }[]
  >([]);
  const storeId = id ? +id : undefined;
  const { stationsQuery } = useStationService({
    storeId,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      stationId: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (_onSubmit) {
      _onSubmit(data);
    }

    // Reset form and close dialog after successful submission
    reset();
    setIsCreateDialogOpen(false);
  };

  const onCreateOptionStation = () => {
    if (stationsQuery && stationsQuery.length > 0) {
      const options = stationsQuery.map(
        (station: { id: number; name: string }) => ({
          value: station.id.toString(),
          label: station.name,
        })
      );
      setOptionStation(options);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
    onCreateOptionStation();
  }, [defaultValues, reset]);

  return (
    <>
      <Button
        variant="primary"
        className="absolute top-4 right-4"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <LuPlus className="w-4 h-4" />
        Add Product
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product and assign it to a station
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              id="product-name"
              label="Product Name"
              placeholder="e.g., Caesar Salad"
              error={errors.name?.message}
              {...register("name", {
                required: "Product name is required",
                minLength: {
                  value: 2,
                  message: "Product name must be at least 2 characters",
                },
              })}
            />

            <Controller
              name="stationId"
              control={control}
              rules={{ required: "Please select a station" }}
              render={({ field }) => (
                <div>
                  <Select
                    id="product-station"
                    label="Station"
                    options={optionStation}
                    placeholder="Select a station"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  {errors.stationId && (
                    <p className="text-[var(--color-danger)] text-sm mt-1">
                      {errors.stationId.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default AddUpProductForm;
