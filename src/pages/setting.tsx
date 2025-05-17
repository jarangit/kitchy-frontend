import { openModal } from "@/store/slices/modal-slice";
import HeaderSection from "../components/ui-system/components/header-section";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toggleSound } from "@/store/slices/notice-slice";
import { deleteOrderAll } from "@/service/order-service";
import { toast } from "sonner";
import { useState } from "react";

const SettingPage = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
  const { orders } = useAppSelector((state) => state.orders);
  const onToggleSound = () => {
    dispatch(toggleSound());
  };
  const handleDelete = async () => {
    console.log(orders);
    dispatch(
      openModal({
        title: `Delete All Orders (${orders?.length})?`,
        content: `This action will permanently remove all pending and completed orders from the system.
Are you sure you want to proceed?`,
        onConfirm: async () => await onDeleteOrder(),
      })
    );
  };

  const onDeleteOrder = async () => {
    try {
      setIsLoading(true);
      await deleteOrderAll();
      toast.success(`Delete all orders success`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 w-full">
      <HeaderSection title="Setting" />

      <div className="p-[60px] w-full lg:w-1/2 xl:max-w-[600px] flex flex-col gap-[60px]">
        <div className="flex flex-col gap-6">
          <div className="font-bold text-2xl">Notification</div>
          <div className="flex gap-6  w-full justify-between">
            <div className="font-semibold">Enable Sound Notifications</div>
            <div>
              <Switch
                id="airplane-mode"
                checked={isSoundOn}
                onCheckedChange={() => onToggleSound()}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="font-bold text-2xl">Order Management</div>
          <div className="flex gap-6  w-full justify-between items-center p-4 rounded-xl bg-[#ffe5e5] text-red-700">
            <div className="font-semibold">Clear All Orders</div>
            <Button
              className="text-red-700 bg-red-200 shadow-none hover:bg-red-300 cursor-pointer"
              onClick={() => handleDelete()}
              disabled={isLoading}
            >
              {isLoading ? "Clearing..." : "Clear"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
