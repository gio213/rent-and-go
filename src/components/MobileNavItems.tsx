import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navItems } from "@/constants/navItems";
import LocaleSwitcher from "./LocaleSwitcher";
import { ModeToggle } from "./ThemeMode";

export function MobileNavs() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <div className="flex items-center justify-between p-4 ">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Rent and Go</SheetDescription>
          </SheetHeader>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ModeToggle />
          </div>
        </div>

        <nav className="mt-6 grid grid-cols-2 place-items-center">
          {navItems.map((item, index) => (
            <Button
              key={index}
              asChild
              variant="ghost"
              className="w-full justify-center hover:bg-transparent"
            >
              <Link
                href={item.href}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors justify-center"
              >
                {item.icon}
                <span className="text-xl font-bold font-finger">
                  {item.label}
                </span>
              </Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
