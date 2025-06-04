// import axios from "axios";
import type { ICreateOrder, IUpdateOrder } from "./type";
import axiosClient from "./axios-client";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // ✅ ดึงจาก .env
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// ✅ สร้างออเดอร์ใหม่
export const createOrder = async (data: ICreateOrder) => {
  const payload = {
    ...data,
    type: data.orderType,
  };
  const response = await axiosClient.post("/orders", payload);
  return response.data;
};

// ✅ ดึงรายการออเดอร์ทั้งหมด
export const fetchOrders = async () => {
  const response = await axiosClient.get("/orders");
  return response.data;
};

// ✅ ลบออเดอร์ตาม ID
export const deleteOrder = async (id: number) => {
  const response = await axiosClient.delete(`/orders/${id}`);
  return response.data;
};

export const deleteOrderAll = async () => {
  const response = await axiosClient.delete(`/orders/clear`);
  return response.data;
};

// ✅ อัปเดตสถานะออเดอร์
export const updateOrderStatus = async (data: IUpdateOrder) => {
  const { id, ...rest } = data;
  const response = await axiosClient.patch(`/orders/${id}`, { ...rest });
  return response.data;
};

export const report = async () => {
  const res = await axiosClient.get("/orders/report-monitor");
  return res.data;
};
