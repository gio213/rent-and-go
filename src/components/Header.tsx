"use client";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./ThemeMode";
import NavItems from "./NavItems";
import { MobileNavs } from "./MobileNavItems";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import UserProfile from "./UserProfile";
import SearchComponent from "./SearchComponent";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const pathname = usePathname();
  console.log("pathname", pathname);

  const [isAdminRoute, setAdminRoute] = React.useState(false);

  useEffect(() => {
    if (pathname.includes("/admin")) {
      setAdminRoute(true);
    } else {
      setAdminRoute(false);
    }
    return () => setAdminRoute(false);
  }, [pathname]);

  console.log("isAdminRoute", isAdminRoute);

  return (
    <header
      className={` ${
        isAdminRoute ? "hidden" : ""
      } sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Left Section - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          <Separator orientation="vertical" className="h-6 mx-4" />

          {/* Center Section - Navigation (Desktop) */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <NavItems />
          </div>

          <SearchComponent />

          <Separator
            orientation="vertical"
            className="h-6 mx-4 hidden md:block"
          />

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <UserProfile />
            <div className=" hidden md:flex items-center min-w-[80px] justify-center">
              <LocaleSwitcher />
            </div>
            <div className=" hidden md:flex items-center">
              <ModeToggle />
            </div>
            {/* Mobile Navigation */}
            <div className="md:hidden flex-1 flex justify-center">
              <MobileNavs />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
