import React from "react";
import Sidebar from "./sidebar";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { useStoreContextSync } from "@/shared/hooks/use-store-context-sync";
import { cn } from "@/shared/utils/cn";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
};

const Layout = ({ children, noPadding, hideSidebar }: Props) => {
  const isOnline = useNetworkStatus();
  useStoreContextSync();

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
