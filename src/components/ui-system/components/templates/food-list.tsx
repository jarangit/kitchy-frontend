import React from "react";

type Props = {
  data: {
    id: number;
    name: string;
    isActive: boolean;
  }[];
};

const FoodListTemplate = ({ data }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Food List</h2>
      <ul className="list-disc pl-5">
        {data &&
          data?.length &&
          data.map((food) => (
            <li key={food.id} className="mb-2">
              {food.name}
              {food.isActive ? (
                <span className="text-green-500 ml-2">(Active)</span>
              ) : (
                <span className="text-red-500 ml-2">(Inactive)</span>
              )}
             
            </li>
          ))}
      </ul>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Food
        </button>
      </div>
    </div>
  );
};

export default FoodListTemplate;
