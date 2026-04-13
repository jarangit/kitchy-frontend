import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import { setupAutoReload } from "@/shared/utils/idleReload";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    setupAutoReload(10);
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col min-h-screen flex-grow transition-all duration-300 ml-[60px]">
        {!isOnline && (
          <section className="w-full p-1 text-white text-center font-semibold bg-red-600 text-sm">
            You are offline
          </section>
        )}
        <main className="flex-1 flex flex-col p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
