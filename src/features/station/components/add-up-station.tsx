import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { StationFormData } from "@/features/station/types/station.model";
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

import { ColorDot } from "@/shared/components/atoms/color-dot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Props = {
  _onSubmit?: (data: StationFormData) => void;
  defaultValues?: StationFormData;
};

const colorOptions = [
  { value: "bg-blue-500", label: "Blue", class: "bg-blue-500" },
  { value: "bg-green-500", label: "Green", class: "bg-green-500" },
  { value: "bg-orange-500", label: "Orange", class: "bg-orange-500" },
  { value: "bg-purple-500", label: "Purple", class: "bg-purple-500" },
  { value: "bg-red-500", label: "Red", class: "bg-red-500" },
  { value: "bg-yellow-500", label: "Yellow", class: "bg-yellow-500" },
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
      color: "bg-blue-500",
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
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="station-color">Station Color</Label>
              <Controller
                name="color"
                control={control}
                rules={{ required: "Please select a color" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <ColorDot color={color.class} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
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

export default AddUpStationForm;