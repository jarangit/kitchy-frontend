import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addOrder,
  updateOrder,
  removeOrder,
} from "../store/slices/order-slice";
import { socket } from "../socket";
import { toast } from "sonner";

export function useOrderSocket(
  isSoundOn: boolean = true,
  notifySound: HTMLAudioElement
) {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    socket.on("order-deleted", ({ id }) => {
      dispatch(removeOrder(id));
      toast.warning("Order deleted", {
        description: `Order #${id} has been removed from the list.`,
        position: "bottom-right",
      });
    });

    socket.on("new-order", (order) => {
      dispatch(addOrder(order));

      toast.info(`New orders ${order?.type} #${order?.orderNumber}`, {
        position: "bottom-right",
      });
      if (isSoundOn) {
        notifySound.currentTime = 0;
        notifySound.play().catch((err) => {
          console.warn("Unable to play sound:", err);
        });
      }
    });

    socket.on("order-updated", (order) => {
      toast.success(`Order updated #${order?.orderNumber}`, {
        position: "bottom-right",
      });
      dispatch(updateOrder(order));
    });

    return () => {
      socket.off("new-order");
      socket.off("order-deleted");
      socket.off("order-updated");
    };
  }, [dispatch, isSoundOn, notifySound]);
}
