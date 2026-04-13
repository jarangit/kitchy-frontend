import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { StationFormData } from "@/features/station/types/station.model";
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
import { LuPlus } from "react-icons/lu";

type Props = {
  _onSubmit?: (data: StationFormData) => void;
  defaultValues?: StationFormData;
};

const colorOptions = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#22c55e", label: "Green" },
  { value: "#f97316", label: "Orange" },
  { value: "#a855f7", label: "Purple" },
  { value: "#ef4444", label: "Red" },
  { value: "#eab308", label: "Yellow" },
];

const AddUpStationForm = ({ _onSubmit, defaultValues }: Props) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StationFormData>({
    defaultValues: {
      name: "",
      color: "#3b82f6",
      ...defaultValues,
    },
  });

  const onSubmit = (data: StationFormData) => {
    if (_onSubmit) {
      _onSubmit(data);
    }

    // Reset form and close dialog after successful submission
    reset();
    setIsCreateDialogOpen(false);
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <>
      <Button
        variant="primary"
        className="absolute top-4 right-4"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <LuPlus className="w-4 h-4" />
        Add Station
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Station</DialogTitle>
            <DialogDescription>
              Add a new kitchen station to organize your orders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              id="station-name"
              label="Station Name"
              placeholder="e.g., Salad Station"
              error={errors.name?.message}
              {...register("name", {
                required: "Station name is required",
                minLength: {
                  value: 2,
                  message: "Station name must be at least 2 characters",
                },
              })}
            />

            <Controller
              name="color"
              control={control}
              rules={{ required: "Please select a color" }}
              render={({ field }) => (
                <div>
                  <Select
                    id="station-color"
                    label="Station Color"
                    options={colorOptions}
                    placeholder="Select a color"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  {errors.color && (
                    <p className="text-[var(--color-danger)] text-sm mt-1">
                      {errors.color.message}
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
              {isSubmitting ? "Creating..." : "Create Station"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default AddUpStationForm;
