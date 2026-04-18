import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CurrentStationState {
  stationId: string | null;
  stationName: string | null;
}

const initialState: CurrentStationState = {
  stationId: null,
  stationName: null,
};

const currentStationSlice = createSlice({
  name: "currentStation",
  initialState,
  reducers: {
    setCurrentStation: (
      state,
      action: PayloadAction<{ stationId: string; stationName?: string | null }>
    ) => {
      state.stationId = action.payload.stationId;
      state.stationName = action.payload.stationName ?? null;
    },
    setCurrentStationId: (state, action: PayloadAction<string>) => {
      state.stationId = action.payload;
      if (!state.stationName) {
        state.stationName = null;
      }
    },
    clearCurrentStation: (state) => {
      state.stationId = null;
      state.stationName = null;
    },
  },
});

export const {
  setCurrentStation,
  setCurrentStationId,
  clearCurrentStation,
} = currentStationSlice.actions;

export default currentStationSlice.reducer;
