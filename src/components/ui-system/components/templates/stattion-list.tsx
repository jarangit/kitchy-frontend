import React, { useState } from "react";
import AddUpStationForm from "../ORG/form/add-up-station";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useStationService } from "@/hooks/useStation";

type Props = {};

const StattionListTemplate = (props: Props) => {
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
  const onSubmitStation = (data: any) => {
    // Handle the form submission logic here
    if (stationSelected) {
      // If a station is selected, update it
      updateMutation.mutate({
        stationId: stationSelected.id,
        stationData: { name: data.name },
      });
      setStationSelected({
        name: "",
        id: null as any,
      });
      return;
    }
    createMutation.mutate({
      restaurantId: restaurantId as number,
      name: data.name,
    });
  };

  if (stationsQueryIsLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Your Station</h1>
      {stationsQuery && stationsQuery?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stationsQuery.map((item: any) => (
            <div
              className="bg-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-400"
              key={item.id}
            >
              <strong className="">{item.name}</strong>
              {/* button delete */}
              <button
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => {
                  // Handle delete logic here
                  console.log("Delete station:", item.id);
                  deleteMutation.mutate(item.id);
                }}
              >
                Delete
              </button>
              {/* button edit */}
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded mt-2 ml-2"
                onClick={() => {
                  setStationSelected(item);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>No stations found.</div>
      )}

      <div className="p-4 bg-amber-200">
        <h2 className="mt-6">Add New Station</h2>
        <AddUpStationForm
          _onSubmit={onSubmitStation}
          defaultValues={
            stationSelected ? { name: stationSelected?.name } : undefined
          }
        />
      </div>
    </div>
  );
};

export default StattionListTemplate;
