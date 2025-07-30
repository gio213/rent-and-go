import { Home, Info, Car, Phone, Calendar, User } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <Home />,
  },
  {
    href: "/about",
    label: "About",
    icon: <Info />,
  },
  {
    href: "/cars",
    label: "Cars",
    icon: <Car />,
  },
  {
    href: "/book",
    label: "Book Now",
    icon: <Calendar />,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: <Phone />,
  },
];
