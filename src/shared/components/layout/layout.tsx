import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import { setupAutoReload } from "@/shared/utils/idleReload";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
};

const Layout = ({ children, noPadding, hideSidebar }: Props) => {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    setupAutoReload(10);
  }, []);

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex flex-col min-h-screen flex-grow transition-all duration-300${hideSidebar ? "" : " ml-[60px]"}`}>
        {!isOnline && (
          <section className="w-full p-1 text-[var(--color-text-inverse)] text-center font-semibold bg-[var(--color-danger)] text-sm">
            You are offline
          </section>
        )}
        <main className={`flex-1 flex flex-col${noPadding ? "" : " p-4"}`}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
