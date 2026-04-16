import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import { setupAutoReload } from "@/shared/utils/idleReload";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { setCurrentStoreId } from "@/shared/store/slices/current-store-slice";
import { cn } from "@/shared/utils/cn";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
};

const Layout = ({ children, noPadding, hideSidebar }: Props) => {
  const isOnline = useNetworkStatus();
  const dispatch = useAppDispatch();
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const currentStoreId = useAppSelector((state) => state.currentStore.storeId);

  const routeStoreId = storeId ?? id;

  useEffect(() => {
    setupAutoReload(10);
  }, []);

  useEffect(() => {
    if (routeStoreId && currentStoreId !== routeStoreId) {
      dispatch(setCurrentStoreId(routeStoreId));
    }
  }, [dispatch, routeStoreId, currentStoreId]);

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={cn("flex flex-col min-h-screen flex-grow transition-all duration-300", !hideSidebar && "ml-[var(--sidebar-width)]")}>
        {!isOnline && (
          <section className="w-full p-1 text-[var(--color-text-inverse)] text-center font-[var(--weight-semibold)] bg-[var(--color-danger)] text-label">
            You are offline
          </section>
        )}
        <main className={cn("flex-1 flex flex-col", !noPadding && "p-6")}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
