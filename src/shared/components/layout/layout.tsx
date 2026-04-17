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
    <div className="flex min-h-screen bg-bg text-text-primary">
      {!hideSidebar && <Sidebar />}
      <div className={cn("flex min-h-screen flex-grow flex-col transition-all duration-300", !hideSidebar && "ml-sidebar-width")}>
        {!isOnline && (
          <section className="w-full bg-danger-bg py-2 text-center text-label font-[var(--weight-medium)] text-danger">
            You are offline
          </section>
        )}
        <main className={cn("flex flex-1 flex-col", !noPadding && "px-6 py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12")}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
