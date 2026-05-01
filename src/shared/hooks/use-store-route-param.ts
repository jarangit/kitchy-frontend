import { useParams } from "react-router-dom";

export function useStoreRouteParam() {
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  return storeId ?? id;
}
