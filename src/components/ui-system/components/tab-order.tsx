import { useEffect, useState } from "react";
import TabItem from "./tab-item";
import { HiOutlineViewGrid } from "react-icons/hi";
import { LuShoppingBag } from "react-icons/lu";
import { RiRestaurant2Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { useAppSelector } from "../../../hooks/hooks";

type Props = {
  _onClickTabItem: (type: "PENDING" | "TOGO" | "DINEIN" | "COMPLETED") => void;
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
    type: "PENDING" | "TOGO" | "DINEIN" | "COMPLETED"
  ) => {
    setTabActive(type);
    _onClickTabItem(type);
  };
  useEffect(() => {
    setTabActive("PENDING");
    onClickTabItem("PENDING");
  }, []);

  useEffect(() => {
    const total = orders.filter((i) => i.status === "PENDING").length;
    const togo = orders.filter(
      (i) => i.type === "TOGO" && i.status === "PENDING"
    ).length;
    const dineIn = orders.filter(
      (i) => i.type === "DINEIN" && i.status === "PENDING"
    ).length;
    const completed = orders.filter((i) => i.status === "COMPLETED").length;

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
        icon={<FaCheckCircle size={20} color="#34C759" />}
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
        isActive={tabActive === "DINEIN"}
        onClick={() => onClickTabItem("DINEIN")}
      />
    </div>
  );
};

export default TabOrder;
