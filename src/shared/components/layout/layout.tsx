import React from "react";
import Sidebar from "./sidebar";
import { useStoreContextSync } from "@/shared/hooks/use-store-context-sync";
import { cn } from "@/shared/utils/cn";
import { AppBar } from "@/shared/components/layout/app-bar";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
  hideAppBar?: boolean;
};

const Layout = ({ children, noPadding, hideSidebar, hideAppBar }: Props) => {
  useStoreContextSync();

  return (
    <div
      className={cn(
        "flex bg-bg text-text-primary",
        hideSidebar ? "h-dvh overflow-hidden" : "min-h-screen",
      )}
    >
      {!hideSidebar && <Sidebar />}
      <div
        className={cn(
          "flex min-w-0 flex-grow flex-col transition-all duration-300",
          hideSidebar ? "h-full min-h-0 overflow-hidden" : "min-h-screen",
        )}
      >
        {!hideAppBar && <AppBar />}
        <main
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            hideSidebar && "overflow-hidden",
            !noPadding && "page-shell",
            !hideSidebar && "pb-36!",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
