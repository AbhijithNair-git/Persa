"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

const MobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the sidebar when a link is clicked
  };

  return (
    <header className="header z-50">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={120}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64 overflow-y-auto max-h-screen">
              <>
                {/* Accessibility Title */}
                <SheetTitle>
                  <VisuallyHidden>Navigation Menu</VisuallyHidden>
                </SheetTitle>

                {/* Sidebar Logo */}
                <div>
                  <Image
                    src="/assets/images/logo-text.svg"
                    alt="logo"
                    width={152}
                    height={23}
                  />
                </div>

                {/* Navigation Links */}
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        className={`${
                          isActive && "gradient-text"
                        } flex whitespace-nowrap text-dark-700`}
                        key={link.route}
                      >
                        <Link
                          className="sidebar-link cursor-pointer"
                          href={link.route}
                          onClick={handleLinkClick} // Close the sidebar on link click
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
