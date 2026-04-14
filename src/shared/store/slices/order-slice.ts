import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IOrderItem } from "@/features/order/types/order.model";

interface OrdersState {
  orders: IOrderItem[];
  selectedType: "TOGO" | "DINE_IN" | "ALL";
  selectedStatus: "PENDING" | "COMPLETED" | "ALL";
}

const initialState: OrdersState = {
  orders: [],
  selectedType: "ALL",
  selectedStatus: "PENDING",
};

const ordersSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<IOrderItem[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<IOrderItem>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<IOrderItem>) => {
      const idx = state.orders.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) state.orders[idx] = action.payload;
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    setSelectedType: (
      state,
      action: PayloadAction<"TOGO" | "DINE_IN" | "ALL">
    ) => {
      state.selectedType = action.payload;
    },
    setSelectedStatus: (
      state,
      action: PayloadAction<"PENDING" | "COMPLETED" | "ALL">
    ) => {
      state.selectedStatus = action.payload;
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrder,
  removeOrder,
  clearOrders,
  setSelectedType,
  setSelectedStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer;
