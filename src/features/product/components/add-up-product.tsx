import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { ProductFormData } from "@/features/product/types/product.model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useStationService } from "@/features/station/hooks/useStation";
import { useParams } from "react-router-dom";

type Props = {
  _onSubmit?: (data: ProductFormData) => void;
  defaultValues?: ProductFormData;
};



const AddUpProductForm = ({ _onSubmit, defaultValues }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [optionStation, setOptionStation] = useState<
    { value: string; label: string }[]
  >([]);
  const restaurantId = id ? +id : undefined;
  const {
    stationsQuery,
    
  } = useStationService({
    restaurantId,
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
    console.log("🚀 ~ onSubmit ~ data:", data)
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
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 absolute top-4 right-4">
          <Plus className="w-4 h-4 mr-2" />
          Add Station
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Station</DialogTitle>
            <DialogDescription>
              Add a new kitchen station to organize your orders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="station-name">Station Name</Label>
              <Input
                id="station-name"
                {...register("name", {
                  required: "Station name is required",
                  minLength: {
                    value: 2,
                    message: "Station name must be at least 2 characters",
                  },
                })}
                placeholder="e.g., Salad Station"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="station-color">Station</Label>
              <Controller
                name="stationId"
                control={control}
                rules={{ required: "Please select a stationId" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stationId" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionStation.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.stationId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stationId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Station"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUpProductForm;
