/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import GlobalModal from "../common-modal";
import { Toaster } from "sonner";
import Sidebar from "./sidebar";
import { useLocation } from "react-router-dom";
import { setupAutoReload } from "@/utils/idleReload";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const location = useLocation();
  const isOnline = useNetworkStatus();

  const isHideSidebar = location.pathname === "/kitchen-monitor";
  useEffect(() => {
    setupAutoReload(10);
  }, []);
  
  return (
    <>
      <div className="flex">
        {!isHideSidebar && <Sidebar />}
        <div
          className={`"flex flex-col min-h-screen flex-grow transition-all duration-1000 ${
            !isHideSidebar ? "ml-[60px] " : "ml-0"
          }"`}
        >
          {/* <section className="w-full p-3 bg-blue-500 text-white text-center">
            Develop version
          </section> */}
          {!isOnline ? (
            <section
              className={`w-full p-1  text-white text-center font-semibold bg-red-600 !text-sm`}
            >
              You are offline
            </section>
          ) : (
            ""
          )}
          <main className="flex-1 flex flex-col p-4 my-container">
            {children}
          </main>
          <footer className="bg-[#F1F1F1] p-4"></footer>
        </div>
      </div>

      {/* global ui */}
      <GlobalModal />
      <Toaster position="top-right" richColors />

      {/* <LoadingOverlay /> */}
    </>
  );
};

export default Layout;
