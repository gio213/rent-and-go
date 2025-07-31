import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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

// Menu items.

export function AppSidebar() {
  const t = useTranslations("AppSidebar");
  const locale = useLocale();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rent and Go</SidebarGroupLabel>
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
      </SidebarContent>
    </Sidebar>
  );
}
