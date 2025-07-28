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
          className="hover:bg-transparent"
        >
          <Link
            href={`${item.href === "/" ? `/${locale}` : item.href}`}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg  transition-colors  ${item.hoverColor}`}
          >
            {item.icon}
            <span className="text-sm font-bold">{t(item.label)}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default NavItems;
