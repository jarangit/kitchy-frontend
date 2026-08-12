import React from "react";
import { useStoreContextSync } from "@/shared/hooks/use-store-context-sync";
import { cn } from "@/shared/utils/cn";
import { AppBar } from "@/shared/components/layout/app-bar";
import { StoreSideNav } from "@/shared/components/layout/store-side-nav";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
  hideAppBar?: boolean;
  /** Fixed-viewport shell (content scrolls internally). Used by POS / KDS. */
  fullViewport?: boolean;
};

const Layout = ({
  children,
  noPadding,
  hideSidebar,
  hideAppBar,
  fullViewport,
}: Props) => {
  useStoreContextSync();

  return (
    <div
      className={cn(
        "flex bg-bg text-text-primary",
        fullViewport ? "h-dvh overflow-hidden" : "min-h-screen",
      )}
    >
      {!hideSidebar && <StoreSideNav />}
      <div
        className={cn(
          "flex min-w-0 flex-grow flex-col transition-all duration-300",
          fullViewport ? "h-full min-h-0 overflow-hidden" : "min-h-screen",
        )}
      >
        {!hideAppBar && <AppBar />}
        <main
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            fullViewport && "overflow-hidden",
            !noPadding && "page-shell",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
