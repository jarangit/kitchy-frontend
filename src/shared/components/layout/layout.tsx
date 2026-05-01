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
      <div className={cn("flex min-h-screen flex-grow flex-col transition-all duration-300", !hideSidebar && "ml-sidebar-width")}>
        <AppBar />
        <main className={cn("flex flex-1 flex-col", !noPadding && "px-6 py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12")}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
