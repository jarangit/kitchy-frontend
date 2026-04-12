import { useEffect, useState } from "react";
import AddUpStationForm from "@/features/station/components/add-up-station";
import { useParams } from "react-router";
import { useStationService } from "@/features/station/hooks/useStation";
import { StationCard } from "@/features/station/components/station-card";

const StationListTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = id ? +id : undefined;
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
    restaurantId,
  });
  const onSubmitStation = (data: { name: string; color?: string }) => {
    // Handle the form submission logic here
    if (stationSelected) {
      // If a station is selected, update it
      updateMutation.mutate({
        stationId: stationSelected.id,
        stationData: { ...data },
      });
      setStationSelected({
        name: "",
        id: null as any,
      });
      return;
    }
    createMutation.mutate({
      restaurantId: restaurantId as number,
      ...data,
    });
  };

 

  useEffect(() => {
  
  }, [stationsQuery]);

  if (stationsQueryIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative ">
      <div className="p-4">
        <h1>Your Station</h1>
        <AddUpStationForm
          _onSubmit={onSubmitStation}
          defaultValues={
            stationSelected ? { name: stationSelected?.name } : undefined
          }
        />
      </div>
      {stationsQuery && stationsQuery?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stationsQuery.map((item: any) => (
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
                  deleteMutation.mutate(+stationId);
                }}
                // Add any other required props here, e.g.:
                // status={item.status}
                // description={item.description}
              />
              {/* <strong className="">{item.name}</strong> */}
              {/* button delete */}
              {/* <button
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => {
                  // Handle delete logic here
                  console.log("Delete station:", item.id);
                  deleteMutation.mutate(item.id);
                }}
              >
                Delete
              </button> */}
              {/* button edit */}
              {/* <button
                className="bg-yellow-500 text-white px-2 py-1 rounded mt-2 ml-2"
                onClick={() => {
                  setStationSelected(item);
                }}
              >
                Edit
              </button> */}
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
