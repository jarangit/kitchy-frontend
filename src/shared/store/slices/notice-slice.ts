// store/soundSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const noticeSlice = createSlice({
  name: "sound",
  initialState: {
    isSoundOn: true,
  },
  reducers: {
    toggleSound: (state) => {
      state.isSoundOn = !state.isSoundOn;
    },
    setSound: (state, action) => {
      state.isSoundOn = action.payload;
    },
  },
});

export const { toggleSound, setSound } = noticeSlice.actions;
export default noticeSlice.reducer;
