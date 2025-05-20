/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { createOrder, fetchOrders } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";
import HeaderSection from "../components/ui-system/components/header-section";
import { ListOrders } from "../components/ui-system/components/list-orders";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setOrders } from "../store/slices/order-slice";
import { useOrderSocket } from "../hooks/order-socket";

function ServerDineInPage() {
  const orderType = "DINEIN";
  const dispatch = useAppDispatch();
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
  const notifySound = new Audio("/sound/ring.mp3");

  useOrderSocket(isSoundOn, notifySound);

  const handleSubmit = async ({ orderNumber, orderType }: any) => {
    if (!orderNumber) return alert("กรุณากรอกหมายเลขออเดอร์");
    try {
      await createOrder({ orderNumber, orderType });
    } catch (error) {
      console.log(error);
    }

    // dispatch(addOrder(newOrder));
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchOrders();
        if (res) {
          dispatch(setOrders(res));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadOrders();
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <HeaderSection title="Server (Dine-in)" className="bg-green-200 p-4 rounded-lg border-none" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full">
          <ListOrders isCanDelete />
        </div>
        <OrderForm
          orderType={orderType}
          label="Order Number"
          buttonColor="bg-blue-500"
          _onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ServerDineInPage;
