import React from "react";
import Sidebar from "./sidebar";
import { useStoreContextSync } from "@/shared/hooks/use-store-context-sync";
import { cn } from "@/shared/utils/cn";
import { AppBar } from "@/shared/components/layout/app-bar";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
};

const Layout = ({ children, noPadding, hideSidebar }: Props) => {
  useStoreContextSync();

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      {!hideSidebar && <Sidebar />}
      <div className={cn("flex min-h-screen min-w-0 flex-grow flex-col transition-all duration-300", !hideSidebar && "ml-sidebar-width")}>
        <AppBar />
        <main className={cn("flex min-h-0 flex-1 flex-col", !noPadding && "px-4 py-4 lg:px-6 lg:py-5 xl:px-7 xl:py-6")}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
