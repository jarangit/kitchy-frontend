/* eslint-disable @typescript-eslint/no-explicit-any */
import OrderCard from "./order-card";
import { deleteOrder } from "../../../service/order-service";
import { GoDotFill } from "react-icons/go";

type Props = {
  orders: any[];
};

export const ListOrders = ({ orders }: Props) => {
  const handleDelete = async (id: number) => {
    await deleteOrder(id);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-medium">
          Orders <span>({orders?.length})</span>
        </h2>
        <div className="flex gap-2 font-semibold">
          <div className="flex  items-center">
            <GoDotFill size={25} color="#34C759" />
            <div>Dine in</div>
          </div>
          <div className="flex  items-center">
            <GoDotFill size={25} color="#FF6B6B" />
            <div>To-go</div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 bg-[#E4E4E4] rounded-lg flex-col p-3">
        {orders?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-4  xl:grid-cols-6 gap-3">
            {orders.map((order, key) => (
              <div key={key}>
                <OrderCard
                  order={order}
                  onDelete={() => handleDelete(order.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            There are currently no orders
          </div>
        )}
      </div>
    </div>
  );
};
