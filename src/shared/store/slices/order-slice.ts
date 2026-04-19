import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * UI-only state for the order list view:
 * - `selectedType`   → which order-type tab is active
 * - `selectedStatus` → which status filter is active
 *
 * NOTE: The list of orders itself is server data and is owned by
 * TanStack Query (`useOrderService().ordersQuery`), not by Redux.
 */
interface OrdersState {
  selectedType: "TOGO" | "DINE_IN" | "ALL";
  selectedStatus: "PENDING" | "COMPLETED" | "ALL";
}

const initialState: OrdersState = {
  selectedType: "ALL",
  selectedStatus: "PENDING",
};

const ordersSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
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

export const { setSelectedType, setSelectedStatus } = ordersSlice.actions;

export default ordersSlice.reducer;
