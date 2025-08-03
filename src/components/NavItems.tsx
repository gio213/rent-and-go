"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { navItems } from "@/constants/navItems";
import { useLocale, useTranslations } from "next-intl";
const NavItems = () => {
  const t = useTranslations("Navigation");
  const locale = useLocale();

  return (
    <nav className="hidden items-center gap-2 md:flex  ">
      {navItems.map((item, index) => (
        <Button
          key={index}
          asChild
          variant="ghost"
          className="hover:bg-accent-foreground/10 hover:text-foreground transition-colors duration-200 flex items-center gap-2 text-sm font-medium text-muted-foreground"
        >
          <Link
            href={`/${locale}${item.href}`}
            className=" flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {item.icon}
            <span className="text-sm font-bold ">{t(item.label)}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default NavItems;
