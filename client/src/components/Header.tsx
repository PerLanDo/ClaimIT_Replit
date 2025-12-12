import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "@assets/generated_images/claimit_app_logo_design.png";

interface HeaderProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSearchChange?: (query: string) => void;
  notificationCount?: number;
  showSearch?: boolean;
}

export function Header({
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  onSearchChange,
  notificationCount = 0,
  showSearch = true,
}: HeaderProps) {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            data-testid="button-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="ClaimIT" className="h-8 w-8" />
            <span className="font-bold text-lg text-primary hidden sm:block">
              ClaimIT
            </span>
          </div>
        </div>

        {showSearch && (
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lost & found items..."
                className="pl-10"
                onChange={(e) => onSearchChange?.(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="rounded-full"
            data-testid="button-profile"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={undefined} alt={user?.fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
