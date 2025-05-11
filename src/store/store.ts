import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modal-slice";
import loadingReducer from "./slices/loading-slice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
