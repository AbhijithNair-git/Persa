import React from "react";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="hidden lg:block w-full p-4">
      <div className="flex items-end">
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
