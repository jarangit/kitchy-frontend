import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modal-slice";
import loadingReducer from "./slices/loading-slice";
import soundReducer from "./slices/notice-slice";
import orderReducer from "./slices/order-slice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    loading: loadingReducer,
    sound: soundReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
