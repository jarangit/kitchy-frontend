import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CurrentStoreState {
  storeId: string | null;
  storeName: string | null;
}

const initialState: CurrentStoreState = {
  storeId: null,
  storeName: null,
};

const currentStoreSlice = createSlice({
  name: "currentStore",
  initialState,
  reducers: {
    setCurrentStore: (
      state,
      action: PayloadAction<{ storeId: string; storeName?: string | null }>
    ) => {
      state.storeId = action.payload.storeId;
      state.storeName = action.payload.storeName ?? null;
    },
    setCurrentStoreId: (state, action: PayloadAction<string>) => {
      state.storeId = action.payload;
      if (!state.storeName) {
        state.storeName = null;
      }
    },
    clearCurrentStore: (state) => {
      state.storeId = null;
      state.storeName = null;
    },
  },
});

export const { setCurrentStore, setCurrentStoreId, clearCurrentStore } =
  currentStoreSlice.actions;

export default currentStoreSlice.reducer;
