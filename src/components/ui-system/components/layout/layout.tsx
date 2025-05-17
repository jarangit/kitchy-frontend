/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import GlobalModal from "../common-modal";
import { Toaster } from "sonner";
import Sidebar from "./sidebar";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col min-h-screen ml-[60px] flex-grow">
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
