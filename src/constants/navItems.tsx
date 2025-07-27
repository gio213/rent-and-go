import { Home, Info, Car, Phone, Calendar, User } from "lucide-react";
import { useLocale } from "next-intl";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
};

export const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <Home />,
    hoverColor: "hover:bg-yellow-100 ",
  },
  {
    href: "/about",
    label: "About",
    icon: <Info />,
    hoverColor: "hover:bg-yellow-100 ",
  },
  {
    href: "/cars",
    label: "Cars",
    icon: <Car />,
    hoverColor: "hover:bg-yellow-100 ",
  },
  {
    href: "/book",
    label: "Book Now",
    icon: <Calendar />,
    hoverColor: "hover:bg-yellow-100 ",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: <Phone />,
    hoverColor: "hover:bg-yellow-100 ",
  },
  {
    href: "/my-bookings",
    label: "My Bookings",
    icon: <User />,
    hoverColor: "hover:bg-yellow-100",
  },
];
