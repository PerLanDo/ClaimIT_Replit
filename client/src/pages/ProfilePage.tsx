import {
  LogOut,
  Settings,
  Award,
  Package,
  CheckCircle,
  Clock,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";

interface ProfilePageProps {
  onBack?: () => void;
  onLogout?: () => void;
  onSettings?: () => void;
  onStatistics?: () => void;
}

export function ProfilePage({
  onBack,
  onLogout,
  onSettings,
  onStatistics,
}: ProfilePageProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // todo: remove mock functionality
  const stats = {
    itemsReported: 8,
    itemsReturned: 5,
    activeClaims: 2,
    reputationScore: user?.reputationScore || 42,
  };

  const recentActivity = [
    {
      action: "Reported found item",
      item: "Car Keys with Red Keychain",
      date: "2 days ago",
    },
    {
      action: "Claim approved",
      item: "Silver MacBook Charger",
      date: "3 days ago",
    },
    {
      action: "Submitted claim",
      item: "Blue iPhone 14 Pro",
      date: "4 days ago",
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-4 max-w-2xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user ? getInitials(user.fullName) : "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-xl font-bold">{user?.fullName}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                {user?.role}
              </Badge>
              <Badge className="bg-gold text-gold-foreground gap-1">
                <Award className="h-3 w-3" />
                {stats.reputationScore} pts
              </Badge>
            </div>
            {user?.department && (
              <p className="text-sm text-muted-foreground mt-2">
                {user.department}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard
          title="Items Reported"
          value={stats.itemsReported}
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Items Returned"
          value={stats.itemsReturned}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Claims"
          value={stats.activeClaims}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Reputation"
          value={stats.reputationScore}
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.item}</p>
              </div>
              <p className="text-xs text-muted-foreground flex-shrink-0">
                {activity.date}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={onStatistics}
        >
          <BarChart3 className="h-5 w-5" />
          Statistics
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          data-testid="button-settings"
          onClick={onSettings}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </Button>
      </Card>
    </div>
  );
}
