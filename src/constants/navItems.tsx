import { Home, Info, Car, Phone } from "lucide-react";

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
    href: "/contact",
    label: "Contact",
    icon: <Phone />,
  },
];
