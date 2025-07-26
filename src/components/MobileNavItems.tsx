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
import { Menu } from "lucide-react";
import Link from "next/link";

export function MobileNavs() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate through the app using the links below.
          </SheetDescription>
        </SheetHeader>
        {navItems.map((item, index) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            className="w-full hover:bg-transparent"
          >
            <Link
              href={item.href}
              className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${item.hoverColor}`}
            >
              {item.icon}
              <span className="text-xl font-bold font-finger">
                {item.label}
              </span>
            </Link>
          </Button>
        ))}
      </SheetContent>
    </Sheet>
  );
}
