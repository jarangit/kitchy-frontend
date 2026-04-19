import { useEffect, useMemo, useState } from "react";
import { LuLayoutGrid, LuShoppingBag, LuUtensils, LuCircleCheck } from "react-icons/lu";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { useOrderService } from "@/features/order/hooks/useOrder";
import {
  normalizeType,
  normalizeStatus,
} from "@/features/order/utils/order-normalizer";
import type { IOrderItem } from "@/features/order/types/order.model";

type OrderTab = "PENDING" | "TOGO" | "DINE_IN" | "COMPLETED";

type Props = {
  _onClickTabItem: (type: OrderTab) => void;
};
const TabOrder = ({ _onClickTabItem }: Props) => {
  const { ordersQuery } = useOrderService({});
  const orders = ordersQuery as IOrderItem[];
  const [tabActive, setTabActive] = useState<OrderTab>("PENDING");

  const handleChange = (value: string) => {
    const next = value as OrderTab;
    setTabActive(next);
    _onClickTabItem(next);
  };

  useEffect(() => {
    setTabActive("PENDING");
    _onClickTabItem("PENDING");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderCount = useMemo(() => {
    const total = orders.filter(
      (i) => normalizeStatus(i.status) === "PENDING",
    ).length;
    const togo = orders.filter(
      (i) =>
        normalizeType(i.type) === "TOGO" &&
        normalizeStatus(i.status) === "PENDING",
    ).length;
    const dineIn = orders.filter(
      (i) =>
        normalizeType(i.type) === "DINE_IN" &&
        normalizeStatus(i.status) === "PENDING",
    ).length;
    const completed = orders.filter(
      (i) => normalizeStatus(i.status) === "COMPLETED",
    ).length;

    return { total, togo, dineIn, completed };
  }, [orders]);

  return (
    <Tabs value={tabActive} onChange={handleChange} variant="chip" size="sm">
      <TabList>
        <Tab
          value="PENDING"
          icon={<LuLayoutGrid size={20} />}
          count={orderCount.total}
          animateOnCountIncrease
        >
          Pending
        </Tab>
        <Tab
          value="COMPLETED"
          icon={<LuCircleCheck size={20} className="text-success" />}
          count={orderCount.completed}
          animateOnCountIncrease
        >
          Completed
        </Tab>
        <Tab
          value="TOGO"
          icon={<LuShoppingBag size={20} />}
          count={orderCount.togo}
        >
          ToGo
        </Tab>
        <Tab
          value="DINE_IN"
          icon={<LuUtensils size={20} />}
          count={orderCount.dineIn}
        >
          DineI
        </Tab>
      </TabList>
    </Tabs>
  );
};

export default TabOrder;
