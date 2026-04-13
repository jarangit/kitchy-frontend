import { useState } from "react";
import AddUpStationForm from "@/features/station/components/add-up-station";
import { useParams } from "react-router";
import { useStationService } from "@/features/station/hooks/useStation";
import { StationCard } from "@/features/station/components/station-card";

const StationListTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const storeId = id ? +id : undefined;
  const [stationSelected, setStationSelected] = useState<{
    name: string;
    id: number;
  }>();
  const {
    stationsQuery,
    createMutation,
    updateMutation,
    stationsQueryIsLoading,
    deleteMutation,
  } = useStationService({
    storeId,
  });
  const onSubmitStation = (data: { name: string; color?: string }) => {
    if (stationSelected) {
      updateMutation.mutate({
        stationId: stationSelected.id,
        stationData: { ...data },
      });
      setStationSelected(undefined);
      return;
    }
    createMutation.mutate({
      storeId: storeId as number,
      ...data,
    });
  };

  if (stationsQueryIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Station</h2>
        <AddUpStationForm
          _onSubmit={onSubmitStation}
          defaultValues={
            stationSelected ? { name: stationSelected?.name } : undefined
          }
        />
      </div>
      {stationsQuery && stationsQuery?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stationsQuery.map((item: { id: number; name: string; color: string; activeOrders: number }) => (
            <div key={item.id}>
              <StationCard
                id={String(item.id)}
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
                  deleteMutation.mutate(+stationId);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>No stations found.</div>
      )}
    </div>
  );
};

export default StationListTemplate;
