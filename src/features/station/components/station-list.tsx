import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useStationService } from "@/features/station/hooks/useStation";
import {
  StationTable,
  type StationRow,
} from "@/features/station/components/station-table";
import { useAppSelector } from "@/shared/hooks/hooks";
import { SettingsSectionCard } from "@/features/store/components/settings-shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { SortingState } from "@/shared/components/ui/data-table";
import type { StationFormData } from "@/features/station/types/station.model";

const colorOptions = [
  { value: "#FFFFFF", label: "White" },
  { value: "#111315", label: "Charcoal" },
];

const StationListTemplate = () => {
  const { t } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const [stationSelected, setStationSelected] = useState<{
    name: string;
    id: string;
  }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const {
    stationsQuery,
    updateMutation,
    stationsQueryIsLoading,
    deleteMutation,
  } = useStationService({});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StationFormData>({
    defaultValues: { name: "", color: "#111315" },
  });

  useEffect(() => {
    if (stationSelected) {
      reset({ name: stationSelected.name, color: "#111315" });
      setIsEditDialogOpen(true);
    }
  }, [stationSelected, reset]);

  const onSubmitEdit = (data: StationFormData) => {
    if (!storeId || !stationSelected) return;
    updateMutation.mutate({
      stationId: stationSelected.id,
      stationData: { ...data },
    });
    setStationSelected(undefined);
    setIsEditDialogOpen(false);
    reset();
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setStationSelected(undefined);
    reset();
  };

  const rows: StationRow[] = useMemo(
    () =>
      (stationsQuery ?? []).map(
        (s: {
          id: string;
          name: string;
          color: string;
          activeOrders?: number;
        }) => ({
          id: s.id,
          name: s.name,
          color: s.color,
          activeOrders: s.activeOrders ?? 0,
        }),
      ),
    [stationsQuery],
  );

  const handleEdit = (id: string) => {
    const station = rows.find((s) => s.id === id);
    if (!station) return;
    setStationSelected({ id: station.id, name: station.name });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (!storeId) {
    return (
      <div className="text-label text-danger">
        {t("settings.categories.missingStore")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title={t("settings.categories.stationsTitle")}
        description={t("settings.categories.stationsDescription")}
        action={
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                disabled
                aria-disabled="true"
                title={t("settings.stations.addLocked.hint")}
              >
                <LuPlus className="h-4 w-4" />
                {t("settings.stations.addLocked.label")}
              </Button>
              <Badge variant="default" size="sm">
                {t("settings.stations.addLocked.badge")}
              </Badge>
            </div>
            <p className="max-w-xs text-caption leading-5 text-text-tertiary">
              {t("settings.stations.addLocked.hint")}
            </p>
          </div>
        }
      >
        <StationTable
          stations={rows}
          sorting={sorting}
          onSortingChange={setSorting}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={stationsQueryIsLoading}
          emptyState={
            <span className="text-body-sm text-text-secondary">
              {t("settings.categories.noStations")}
            </span>
          }
        />
      </SettingsSectionCard>

      <Dialog open={isEditDialogOpen} onClose={handleCloseEdit}>
        <form onSubmit={handleSubmit(onSubmitEdit)}>
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
              rules={{
                required: t("settings.categories.stationColorRequired"),
              }}
              render={({ field }) => (
                <div>
                  <Select
                    id="station-color"
                    label={t("settings.categories.stationColor")}
                    options={colorOptions}
                    placeholder={t(
                      "settings.categories.stationColorPlaceholder",
                    )}
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
              onClick={handleCloseEdit}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("settings.categories.creating")
                : t("settings.categories.create")}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default StationListTemplate;
