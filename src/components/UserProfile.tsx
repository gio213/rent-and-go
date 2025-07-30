"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import {
  LogOut,
  User,
  CreditCard,
  Building2,
  CirclePlus,
  Car,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/authContext";
import LoginButton from "./LoginButton";
import { Role } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";

const UserProfile = () => {
  const { loading, user: dbUser, logout, isLoggedIn } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations("UserProfile");
  const locale = useLocale();

  // Hydration fix for SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Display name logic
  const displayName = dbUser?.role === "USER" ? dbUser.name : dbUser?.lastName;

  // Avatar fallback logic
  const avatarFallback = displayName ? displayName.charAt(0).toUpperCase() : "";

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  // Server-side rendering safety
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {!isLoggedIn ? (
        <LoginButton />
      ) : (
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex  hover:cursor-pointer items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="text-sm font-medium hidden sm:inline-block">
                  {t("hello")}, {displayName}
                  {dbUser?.role && (
                    <span className="text-xs text-muted-foreground ml-1">
                      {`(${dbUser.role})`}
                    </span>
                  )}
                </span>

                <Avatar className="h-8 w-8">
                  <AvatarImage
                    className={`dark:bg-foreground`}
                    src="/assets/person.png"
                    alt={`${displayName}'s profile`}
                  />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span>{t("my account")}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dbUser?.role === "ADMIN" && (
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <Link href={`/${locale}/admin/dashboard`}>
                    <span>{t("admin dashboard")}</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {dbUser?.role === "USER" && (
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <Link href={`/${locale}/my-profile`}>
                    <span>{t("profile")}</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {dbUser?.role === "ADMIN" && (
                <DropdownMenuItem className="cursor-pointer">
                  <Car className="mr-2 h-4 w-4" />
                  <Link href={`/${locale}/admin/cars`}>
                    <span>{t("list of cars")}</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {dbUser?.role === "ADMIN" && (
                <DropdownMenuItem className="cursor-pointer">
                  <CirclePlus className="mr-2 h-4 w-4" />
                  <Link href={`/${locale}/admin/add-car`}>
                    <span>{t("add card")}</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <Button className="w-full" asChild>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-shadow-background" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
