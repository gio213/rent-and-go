import { CarIcon, LayoutDashboardIcon, PlusCircle } from "lucide-react";

type AdminDashboardLink = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export const adminDashboardLinks: AdminDashboardLink[] = [
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
