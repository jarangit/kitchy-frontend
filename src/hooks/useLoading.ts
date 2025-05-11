import { startLoading, stopLoading } from "../store/slices/loading-slice";
import { useAppDispatch, useAppSelector } from "./hooks";

export function useLoading() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  return {
    isLoading,
    startLoading: () => dispatch(startLoading()),
    stopLoading: () => dispatch(stopLoading()),
  };
}
