import { useEffect, useState } from "react";
import TabItem from "./tab-item";
import { HiOutlineViewGrid } from "react-icons/hi";
import { LuShoppingBag } from "react-icons/lu";
import { RiRestaurant2Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { useAppSelector } from "@/shared/hooks/hooks";

const toLegacyStatus = (status: string) => {
  if (status === "NEW" || status === "PREPARING") return "PENDING";
  if (status === "READY") return "COMPLETED";
  return status;
};

const normalizeType = (type: string) => {
  if (type === "DINEIN") return "DINE_IN";
  return type;
};

type Props = {
  _onClickTabItem: (type: "PENDING" | "TOGO" | "DINE_IN" | "COMPLETED") => void;
};
const TabOrder = ({ _onClickTabItem }: Props) => {
  const orders = useAppSelector((state) => state.orders.orders);
  const [tabActive, setTabActive] = useState("PENDING");
  const [orderCount, setOrderCount] = useState({
    total: 0,
    togo: 0,
    dineIn: 0,
    completed: 0,
  });

  const onClickTabItem = (
    type: "PENDING" | "TOGO" | "DINE_IN" | "COMPLETED"
  ) => {
    setTabActive(type);
    _onClickTabItem(type);
  };
  useEffect(() => {
    setTabActive("PENDING");
    onClickTabItem("PENDING");
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
    <div className="flex gap-2 flex-wrap">
      <TabItem
        title={`Pending`}
        count={orderCount.total}
        icon={<HiOutlineViewGrid size={20} />}
        isActive={tabActive === "PENDING"}
        isCanAnimation={true}
        onClick={() => onClickTabItem("PENDING")}
      />
      <TabItem
        title={`Completed `}
        count={orderCount.completed}
        icon={<FaCheckCircle size={20} style={{ color: 'var(--color-success)' }} />}
        isActive={tabActive === "COMPLETED"}
        isCanAnimation={true}
        onClick={() => onClickTabItem("COMPLETED")}
      />
      <TabItem
        title={`ToGo`}
        count={orderCount.togo}
        icon={<LuShoppingBag size={20} />}
        isActive={tabActive === "TOGO"}
        onClick={() => onClickTabItem("TOGO")}
      />
        <TabItem
          title={`DineI`}
          count={orderCount.dineIn}
          icon={<RiRestaurant2Fill size={20} />}
          isActive={tabActive === "DINE_IN"}
          onClick={() => onClickTabItem("DINE_IN")}
        />
    </div>
  );
};

export default TabOrder;
