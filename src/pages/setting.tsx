import { openModal } from "@/store/slices/modal-slice";
import HeaderSection from "../components/ui-system/components/header-section";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toggleSound } from "@/store/slices/notice-slice";
import { deleteOrderAll, report } from "@/service/order-service";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ReportMonitor from "@/components/ui-system/components/ORG/report-monitor";
import type { IReport } from "@/service/report-type";

const SettingPage = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
  const { orders } = useAppSelector((state) => state.orders);
  const [reportData, setReportData] = useState<IReport>();
  const onToggleSound = () => {
    dispatch(toggleSound());
  };
  const handleDelete = async () => {
    dispatch(
      openModal({
        title: `Delete All Orders (${orders?.length})?`,
        content: `This action will permanently remove all pending and completed orders from the system.
Are you sure you want to proceed?`,
        template: "DELETE",
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
      onGetReport();
    }
  };
  const onGetReport = async () => {
    try {
      const res: IReport = await report();
      if (res) {
        setReportData(res);
      }
    } catch (error) {
      console.log("🚀 ~ onGetReport ~ error:", error);
    }
  };

  useEffect(() => {
    onGetReport();
  }, []);

  useEffect(() => {}, [orders]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <HeaderSection title="Setting" />
      <section
        id="grid"
        className="grid grid-cols-1 md:grid-cols-2 px-[60px] pt-[60px] gap-12"
      >
        <div className="flex flex-col gap-[60px]">
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

        {/* report */}
        <div className="flex flex-col h-[calc(100vh-120px)]">
          <div className="flex-1 min-h-0 overflow-y-auto rounded-xl">
            {reportData ? <ReportMonitor data={reportData} /> : ""}
            {/* {reportData ? <ReportMonitorV2 /> : ""} */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingPage;
