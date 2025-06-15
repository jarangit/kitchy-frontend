// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect } from "react";
// import { createOrder, fetchOrders } from "../service/order-service";
// import { OrderForm } from "../components/ui-system/components/order-form";
// import HeaderSection from "../components/ui-system/components/header-section";
// import { ListOrders } from "../components/ui-system/components/list-orders";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { setOrders } from "../store/slices/order-slice";
// import { useOrderSocket } from "../hooks/order-socket";
// import type { ICreateOrder } from "@/service/type";
// import { toast } from "sonner";
// import { useLoading } from "@/hooks/useLoading";
// import { openModal } from "@/store/slices/modal-slice";

// function TogoPage() {
//   const orderType = "TOGO";
//   const dispatch = useAppDispatch();
//   const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
//   const notifySound = new Audio("/sound/ring.mp3");
//   const { startLoading, stopLoading } = useLoading();

//   useOrderSocket(isSoundOn, notifySound);

//   const handleSubmit = async (data: ICreateOrder) => {
//     const { orderNumber } = data;
//     if (!orderNumber) return alert("กรุณากรอกหมายเลขออเดอร์");
//     try {
//       startLoading();
//       await createOrder(data);
//     } catch (error) {
//       dispatch(
//         openModal({
//           title: "",
//           template: "ERROR",
//           content: "",
//         })
//       );
//     } finally {
//       stopLoading();
//     }
//   };

//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         const res = await fetchOrders();
//         if (res) {
//           dispatch(setOrders(res));
//         }
//       } catch (error) {
//         toast.error("Failed to load orders. Please try again later.");
//       }
//     };
//     loadOrders();
//   }, [dispatch]);

//   return (
//     <div className="flex flex-col gap-6">
//       <HeaderSection
//         title="Front-desk(To-Go)"
//         className="bg-red-200 p-4 rounded-lg border-none"
//       />
//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="w-full">
//           <ListOrders isCanDelete />
//         </div>
//         <OrderForm
//           orderType={orderType}
//           label="ToGo Order"
//           buttonColor="bg-blue-500"
//           _onSubmit={handleSubmit}
//         />
//       </div>
//     </div>
//   );
// }

// export default TogoPage;
