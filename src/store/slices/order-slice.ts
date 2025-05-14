/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Order {
  id: any;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  createdAt: string;
  status: "PENDING" | "COMPLETED";
}

interface OrdersState {
  orders: Order[];
  selectedType: "TOGO" | "DINEIN" | "ALL";
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
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const idx = state.orders.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) state.orders[idx] = action.payload;
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    setSelectedType: (
      state,
      action: PayloadAction<"TOGO" | "DINEIN" | "ALL">
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
