import React from "react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./ThemeMode";
import NavItems from "./NavItems";
import { MobileNavs } from "./MobileNavItems";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import LocaleSwitcher from "./LocaleSwitcher";
import UserProfile from "./UserProfile";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex-1 flex justify-center">
            <MobileNavs />
          </div>

          <Separator
            orientation="vertical"
            className="h-6 mx-4 hidden md:block"
          />

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <UserProfile />
            <div className="flex items-center min-w-[80px] justify-center">
              <LocaleSwitcher />
            </div>
            <div className="flex items-center">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
