/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <header className="bg-gray-200 p-6 border-b border-gray-400">
          <div className="flex justify-between w-full">
            <Link to={"/"}>
              <h1 className="text-2xl">Home</h1>
            </Link>
            <Link to={"/create-order"}>
              {" "}
              <div>Add Order</div>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col p-4">{children}</main>
        <footer className="bg-gray-300 p-4">
          <p>Footer</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
