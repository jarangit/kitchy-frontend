// TODO: design for edit mode
import type React from "react";
import { useEffect, useState } from "react";
import { NumericKeypad } from "@/shared/components/numbericKeypad";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { IOrderItem } from "@/features/order/types/order.model";

interface OrderFormProps {
  orderType: "TOGO" | "DINE_IN" | "";
  label: string;
  buttonColor: string;
  initValue?: IOrderItem;
  _onSubmit: ({
    orderType,
    orderNumber,
    isWaitingInStore,
  }: {
    orderType: string;
    orderNumber: string;
    isWaitingInStore: boolean;
  }) => void;
}

type WaitingKey = "here" | "waiting";

export function OrderForm({
  label,
  _onSubmit,
  orderType,
  initValue,
}: OrderFormProps) {
  const { t } = useTranslation();
  const [number, setNumber] = useState("");
  const [isWaitingInStore, setIsWaitingInStore] = useState(false);

  const handleSubmit = () => {
    _onSubmit({
      orderType,
      orderNumber: number,
      isWaitingInStore,
    });
    setNumber("");
    setIsWaitingInStore(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const onInitValue = () => {
    if (initValue) {
      setNumber(initValue.orderNumber || "");
      setIsWaitingInStore(initValue.isWaitingInStore || false);
    } else {
      setNumber("");
      setIsWaitingInStore(false);
    }
  };

  useEffect(() => {
    onInitValue();
  }, [initValue]);

  const dineInItems = [
    { key: "here" as const, label: t("order.form.table") },
    { key: "waiting" as const, label: t("order.form.waitingTogo") },
  ];
  const togoItems = [
    { key: "here" as const, label: t("order.form.pickup") },
    { key: "waiting" as const, label: t("order.form.waitingPickup") },
  ];
  const items = orderType === "DINE_IN" ? dineInItems : togoItems;
  const waitingValue: WaitingKey = isWaitingInStore ? "waiting" : "here";

  return (
    <form
      onSubmit={handleFormSubmit}
      className="rounded-card border border-card-border bg-card-bg p-card-padding lg:min-w-[300px]"
    >
      <div className="flex flex-col space-y-4">
        <Label htmlFor="orderNumber">{label}</Label>
        <Input
          id="orderNumber"
          value={number}
          placeholder={t("order.form.orderNumberPlaceholder")}
          onChange={(e) => setNumber(e.target.value)}
          keyboardToggle
        />

        <Tabs
          value={waitingValue}
          onChange={(v) => setIsWaitingInStore(v === "waiting")}
          variant="segmented"
        >
          <TabList fullWidth>
            {items.map((item) => (
              <Tab key={item.key} value={item.key}>
                {item.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <div className="flex flex-col space-y-4">
          <NumericKeypad
            value={number}
            onChange={setNumber}
            onSubmit={handleSubmit}
            maxLength={4}
          />
        </div>
      </div>
    </form>
  );
}
