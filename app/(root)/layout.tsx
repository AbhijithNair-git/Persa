import React from "react";
import Sidebar from "../../components/shared/Sidebar";
import MobileNav from "../../components/shared/MobileNav";
import Navbar from "../../components/shared/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root relative">
      <Sidebar />
      <MobileNav />
      <div className="flex-col w-full">
        <Navbar />
        <div className="root-container relative ">
          <div className="wrapper">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
