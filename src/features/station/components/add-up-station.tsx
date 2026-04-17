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
import { useTranslation } from "@/shared/i18n/use-translation";

type Props = {
  _onSubmit?: (data: StationFormData) => void;
  defaultValues?: StationFormData;
};

const colorOptions = [
  { value: "#FFFFFF", label: "White" },
  { value: "#111315", label: "Charcoal" },
];

const AddUpStationForm = ({ _onSubmit, defaultValues }: Props) => {
  const { t } = useTranslation();
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
      color: "#111315",
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
        size="sm"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <LuPlus className="h-4 w-4" />
        {t("settings.categories.addStation")}
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("settings.categories.createTitle")}</DialogTitle>
            <DialogDescription>
              {t("settings.categories.createDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              id="station-name"
              label={t("settings.categories.stationName")}
              placeholder={t("settings.categories.stationNamePlaceholder")}
              error={errors.name?.message}
              {...register("name", {
                required: t("settings.categories.stationNameRequired"),
                minLength: {
                  value: 2,
                  message: t("settings.categories.stationNameMin"),
                },
              })}
            />

            <Controller
              name="color"
              control={control}
              rules={{ required: t("settings.categories.stationColorRequired") }}
              render={({ field }) => (
                <div>
                  <Select
                    id="station-color"
                    label={t("settings.categories.stationColor")}
                    options={colorOptions}
                    placeholder={t("settings.categories.stationColorPlaceholder")}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  {errors.color && (
                    <p className="text-danger text-label mt-1">
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
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("settings.categories.creating") : t("settings.categories.create")}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default AddUpStationForm;
