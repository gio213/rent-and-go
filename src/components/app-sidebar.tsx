import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { adminDashboardLinks } from "@/constants/adminDashboardLinks";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import UserProfile from "./UserProfile";

// Menu items.

export function AppSidebar() {
  const t = useTranslations("AppSidebar");
  const locale = useLocale();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rent and Go Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminDashboardLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`/${locale}${item.href}`}>
                      {item.icon}
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer pinned to the bottom of the sidebar */}
        <SidebarFooter className="mt-auto">
          <UserProfile />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
