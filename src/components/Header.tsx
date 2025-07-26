"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./ThemeMode";
import NavItems from "./NavItems";
import { MobileNavs } from "./MobileNavItems";
import Logo from "./Logo";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Logo />
          <Separator orientation="vertical" className="h-6" />

          {/* Desktop Navigation */}

          <NavItems />

          <Separator orientation="vertical" className="h-6" />
          {/* Theme Toggle and mobile navs */}
          <MobileNavs />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
