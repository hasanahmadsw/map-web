"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useStaffMe } from "@/hooks/staff/useStaffMe";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";

interface UserMenuProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export function UserMenu({ variant = "ghost", size = "icon", showLabel = false, className }: UserMenuProps) {
  const { logout } = useAuth();
  const { currentStaff, isLoading } = useStaffMe();
  const { t } = useTranslation();
  const lang = useLang();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (showLabel) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className} disabled={isLoading}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentStaff?.image ?? ""} alt={currentStaff?.name} />
                <AvatarFallback className="text-xs">{getUserInitials(currentStaff?.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block">{currentStaff?.name}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentStaff?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentStaff?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/dashboard/profile`} className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{t.header.profile}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/dashboard`} className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t.header.dashboard}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t.header.signOut}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isLoading}>
          <span className="sr-only">Open user menu</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentStaff?.image ?? ""} alt={currentStaff?.name} />
            <AvatarFallback>{getUserInitials(currentStaff?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentStaff?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{currentStaff?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/profile`} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t.header.profile}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard`} className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t.header.dashboard}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.header.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
