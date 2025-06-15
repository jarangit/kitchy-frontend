// import { useEffect } from "react";
// import { fetchOrders } from "../service/order-service";
// import HeaderSection from "../components/ui-system/components/header-section";
// import { ListOrders } from "../components/ui-system/components/list-orders";
// import { useLoading } from "../hooks/useLoading";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { useOrderSocket } from "../hooks/order-socket";
// import { setOrders } from "../store/slices/order-slice";
// import { toast } from "sonner";

// // interface Order {
// //   id: number;
// //   orderNumber: string;
// //   type: "TOGO" | "DINEIN";
// //   status: string;
// //   createdAt: string;
// // }
// const notifySound = new Audio("/sound/ring.mp3"); // ✅ ชี้ไปที่ public/notify.mp3

// function KitchenMonitor() {
//   const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
//   const { startLoading, stopLoading } = useLoading(); // ✅ เรียก Hook มาใช้
//   // const orders = useAppSelector((state) => state.orders.orders);
//   const dispatch = useAppDispatch();
//   useOrderSocket(isSoundOn, notifySound);

//   useEffect(() => {
//     const loadOrders = async () => {
//       startLoading();
//       try {
//         const data = await fetchOrders();
//         dispatch(setOrders(data));
//       } catch (err) {
//        toast.error("Failed to load orders. Please try again later.");
//       } finally {
//         stopLoading();
//       }
//     };

//     loadOrders();
//   }, []);
//   useEffect(() => {
//     const unlockAudio = () => {
//       notifySound.load();
//       window.removeEventListener("click", unlockAudio);
//     };
//     window.addEventListener("click", unlockAudio);
//     return () => window.removeEventListener("click", unlockAudio);
//   }, []);
//   return (
//     <div id="content-page" className="flex-1 flex flex-col gap-6">
//       <HeaderSection title="Kitchen monitor" />
//       <ListOrders isCanUpdate={true} />
//     </div>
//   );
// }

// export default KitchenMonitor;
