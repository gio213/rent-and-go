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
  Crown,
  CoinsIcon,
  Building2,
  CirclePlus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/authContext";
import LoginButton from "./LoginButton";

const UserProfile = () => {
  const { loading, user: dbUser, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

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
      {!dbUser ? (
        <LoginButton />
      ) : (
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex  hover:cursor-pointer items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="text-sm font-medium hidden sm:inline-block">
                  Hello, {displayName}
                  {dbUser.role && (
                    <span className="text-xs text-muted-foreground ml-1">
                      {`(${dbUser.role})`}
                    </span>
                  )}
                </span>

                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/assets/vest.png"
                    alt={`${displayName}'s profile`}
                  />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span>My account</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <Link href="/my-profile">
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <Link href="/my-profile/manage-credits">
                  <span>Buy Credits</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" />
                <Link href="/my-profile/my-listings">
                  <span>My Propertie</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CirclePlus className="mr-2 h-4 w-4" />
                <Link href="/my-profile/add-property">
                  <span>Add property</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Button className="w-full" asChild>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-shadow-background" />
                  <span>Logout</span>
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
