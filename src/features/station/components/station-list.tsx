import { useMemo, useState } from "react";
import AddUpStationForm from "@/features/station/components/add-up-station";
import { useStationService } from "@/features/station/hooks/useStation";
import {
  StationTable,
  type StationRow,
} from "@/features/station/components/station-table";
import { useAppSelector } from "@/shared/hooks/hooks";
import { SettingsSectionCard } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { SortingState } from "@/shared/components/ui/data-table";

const StationListTemplate = () => {
  const { t } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const [stationSelected, setStationSelected] = useState<{
    name: string;
    id: string;
  }>();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const {
    stationsQuery,
    createMutation,
    updateMutation,
    stationsQueryIsLoading,
    deleteMutation,
  } = useStationService({});

  const onSubmitStation = (data: { name: string; color?: string }) => {
    if (!storeId) return;

    if (stationSelected) {
      updateMutation.mutate({
        stationId: stationSelected.id,
        stationData: { ...data },
      });
      setStationSelected(undefined);
      return;
    }
    createMutation.mutate({ ...data });
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
          <AddUpStationForm
            _onSubmit={onSubmitStation}
            defaultValues={
              stationSelected ? { name: stationSelected?.name } : undefined
            }
          />
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
    </div>
  );
};

export default StationListTemplate;
