import { useState } from "react";
import AddUpStationForm from "@/features/station/components/add-up-station";
import { useStationService } from "@/features/station/hooks/useStation";
import { StationCard } from "@/features/station/components/station-card";
import { useAppSelector } from "@/shared/hooks/hooks";
import { SettingsSectionCard } from "@/features/store/components/settings-shell";

const StationListTemplate = () => {
  const storeId = useAppSelector((state) => state.currentStore.storeId);
  const [stationSelected, setStationSelected] = useState<{
    name: string;
    id: string;
  }>();
  const {
    stationsQuery,
    createMutation,
    updateMutation,
    stationsQueryIsLoading,
    deleteMutation,
  } = useStationService({});
  const onSubmitStation = (data: { name: string; color?: string }) => {
    if (!storeId) {
      return;
    }

    if (stationSelected) {
      updateMutation.mutate({
      stationId: stationSelected.id,
        stationData: { ...data },
      });
      setStationSelected(undefined);
      return;
    }
    createMutation.mutate({
      ...data,
    });
  };

  if (!storeId) {
    return (
      <div className="text-sm text-[var(--color-danger)]">
        Cannot create station: missing store id.
      </div>
    );
  }

  if (stationsQueryIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Stations"
        description="Manage the station groups used as product categories in this store."
      >
        <AddUpStationForm
          _onSubmit={onSubmitStation}
          defaultValues={
            stationSelected ? { name: stationSelected?.name } : undefined
          }
        />
        <div className="mt-6">
          {stationsQuery && stationsQuery?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {stationsQuery.map((item: { id: string; name: string; color: string; activeOrders: number }) => (
                <div key={item.id}>
                  <StationCard
                    id={item.id}
                    name={item.name}
                    color={item.color}
                    activeOrders={item.activeOrders}
                    completedToday={0}
                    displaySettings={{
                      cardColor: "",
                      textSize: "large",
                      soundEnabled: false,
                    }}
                    onDelete={(stationId: string) => {
                      deleteMutation.mutate(stationId);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>No stations found.</div>
          )}
        </div>
      </SettingsSectionCard>
    </div>
  );
};

export default StationListTemplate;
