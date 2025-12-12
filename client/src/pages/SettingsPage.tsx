import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  BellOff,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    claimUpdates: true,
    newMatches: true,
  });

  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="space-y-6 pb-20 md:pb-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Appearance */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                {isDark
                  ? "Currently using dark theme"
                  : "Currently using light theme"}
              </p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={handleThemeToggle} />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive alerts on your device
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, push: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellOff className="h-5 w-5" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Claim Updates</p>
              <p className="text-sm text-muted-foreground">
                Get notified when your claims are updated
              </p>
            </div>
            <Switch
              checked={notifications.claimUpdates}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, claimUpdates: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Matches</p>
              <p className="text-sm text-muted-foreground">
                Alert when items match your lost reports
              </p>
            </div>
            <Switch
              checked={notifications.newMatches}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, newMatches: checked }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Account & Privacy */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Account
        </h2>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between px-0 h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Privacy & Security</p>
                <p className="text-sm text-muted-foreground">
                  Manage your data and account security
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Separator />

          <div className="py-3 px-0">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5" /> {/* Spacer for alignment */}
              <div>
                <p className="font-medium text-sm text-muted-foreground">
                  Signed in as
                </p>
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Support
        </h2>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between px-0 h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Help Center</p>
                <p className="text-sm text-muted-foreground">
                  FAQs and support resources
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Separator />

          <Button
            variant="ghost"
            className="w-full justify-between px-0 h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">About ClaimIT</p>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
