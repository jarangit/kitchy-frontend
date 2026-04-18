import { useEffect, useState } from "react";
import { LuLayoutGrid, LuShoppingBag, LuUtensils, LuCircleCheck } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";

const toLegacyStatus = (status: string) => {
  if (status === "NEW" || status === "PREPARING") return "PENDING";
  if (status === "READY") return "COMPLETED";
  return status;
};

const normalizeType = (type: string) => {
  if (type === "DINEIN") return "DINE_IN";
  return type;
};

type OrderTab = "PENDING" | "TOGO" | "DINE_IN" | "COMPLETED";

type Props = {
  _onClickTabItem: (type: OrderTab) => void;
};
const TabOrder = ({ _onClickTabItem }: Props) => {
  const orders = useAppSelector((state) => state.orders.orders);
  const [tabActive, setTabActive] = useState<OrderTab>("PENDING");
  const [orderCount, setOrderCount] = useState({
    total: 0,
    togo: 0,
    dineIn: 0,
    completed: 0,
  });

  const handleChange = (value: string) => {
    const next = value as OrderTab;
    setTabActive(next);
    _onClickTabItem(next);
  };

  useEffect(() => {
    setTabActive("PENDING");
    _onClickTabItem("PENDING");
  }, []);

  useEffect(() => {
    const total = orders.filter((i) => toLegacyStatus(i.status) === "PENDING").length;
    const togo = orders.filter(
      (i) => normalizeType(i.type) === "TOGO" && toLegacyStatus(i.status) === "PENDING"
    ).length;
    const dineIn = orders.filter(
      (i) =>
        normalizeType(i.type) === "DINE_IN" && toLegacyStatus(i.status) === "PENDING"
    ).length;
    const completed = orders.filter(
      (i) => toLegacyStatus(i.status) === "COMPLETED"
    ).length;

    setOrderCount({
      total,
      togo,
      dineIn,
      completed,
    });
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
