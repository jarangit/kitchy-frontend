/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Order {
  id: any;
  /* ... */
}

const ordersSlice = createSlice({
  name: "order",
  initialState: {
    orders: [] as Order[],
  },
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const idx = state.orders.findIndex((o:any) => o.id === action.payload.id);
      if (idx !== -1) state.orders[idx] = action.payload;
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});
export const { setOrders, addOrder, updateOrder, removeOrder, clearOrders } =
  ordersSlice.actions;
export default ordersSlice.reducer;
