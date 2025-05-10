/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { CgHome } from "react-icons/cg";
import { Link } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        {/* <header className="bg-[#F1F1F1] p-6 border-b border-gray-300">
          <div className="flex justify-between w-full">
            <Link to={"/"}>
              <div className="flex items-center gap-2">
                <CgHome size={25}/>
                <h1 className="text-2xl font-bold">Home</h1>
              </div>
            </Link>
       
          </div>
        </header> */}
        <main className="flex-1 flex flex-col p-4 my-container">{children}</main>
        <footer className="bg-[#F1F1F1] p-4">
        </footer>
      </div>
    </div>
  );
};

export default Layout;
