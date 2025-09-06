import { CarIcon, Home, LayoutDashboardIcon, PlusCircle } from "lucide-react";

type AdminDashboardLink = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export const adminDashboardLinks: AdminDashboardLink[] = [
  {
    title: "admin home",
    href: "/",
    icon: <Home />,
  },
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Add Car",
    href: "/admin/add-car",
    icon: <PlusCircle />,
  },
  {
    title: "List Cars",
    href: "/admin/cars",
    icon: <CarIcon />,
  },
];
