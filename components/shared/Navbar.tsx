'use client';
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser(); // Get user details from Clerk

  return (
    <div className="hidden lg:block w-full p-4">
      <div className="flex items-center justify-between">
        {/* Centered Welcome Message */}
        <h2 className="text-lg font-semibold text-gray-700 text-center flex-1">
          Hello, {user?.firstName || "Guest"} ! 👋
        </h2>

        {/* User Button on the Right */}
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
