/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import GlobalModal from "../common-modal";
import { Toaster } from "sonner";
import Sidebar from "./sidebar";
import { useLocation } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const location = useLocation();

  const isHideSidebar = location.pathname === "/kitchen-monitor";

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
