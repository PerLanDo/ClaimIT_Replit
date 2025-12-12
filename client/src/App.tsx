import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { cn } from "@/lib/utils";
import { LoginPage } from "@/pages/LoginPage";
import { Dashboard } from "@/pages/Dashboard";
import { SearchPage } from "@/pages/SearchPage";
import { ReportItemPage } from "@/pages/ReportItemPage";
import { ItemDetailPage } from "@/pages/ItemDetailPage";
import { ClaimsPage } from "@/pages/ClaimsPage";
import { MessagesPage } from "@/pages/MessagesPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { StatisticsPage } from "@/pages/StatisticsPage";
import type { Item } from "@/lib/types";

// todo: remove mock functionality
const mockItem: Item = {
  id: "1",
  reporterId: "2",
  type: "found",
  category: "electronics",
  status: "open",
  title: "Blue iPhone 14 Pro",
  description:
    "Found near CCS building entrance. The phone is in good condition with a blue case. Screen protector is intact. Found it on the bench near the entrance.",
  location: "CCS Building",
  imageUrls: [
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
  ],
  isHighValue: true,
  dateReported: new Date("2024-12-10"),
  dateLostFound: new Date("2024-12-10"),
  qrCode: "CLAIMIT-1",
  turnoverToSID: true,
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState<
    "home" | "search" | "report" | "messages" | "profile"
  >("home");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Sync activeNav with current location
  useEffect(() => {
    if (location === "/" || location === "/admin") {
      setActiveNav("home");
    } else if (location === "/search") {
      setActiveNav("search");
    } else if (location === "/report") {
      setActiveNav("report");
    } else if (location === "/messages") {
      setActiveNav("messages");
    } else if (location === "/profile") {
      setActiveNav("profile");
    }
  }, [location]);

  const handleNavClick = (item: typeof activeNav) => {
    setActiveNav(item);
    switch (item) {
      case "home":
        setLocation("/");
        break;
      case "search":
        setLocation("/search");
        break;
      case "report":
        setLocation("/report");
        break;
      case "messages":
        setLocation("/messages");
        break;
      case "profile":
        setLocation("/profile");
        break;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setLocation("/")} />;
  }

  const isAdmin = user?.role === "sid_admin";

  return (
    <div className="min-h-screen bg-background">
      <Header
        notificationCount={2}
        onNotificationClick={() => setLocation("/notifications")}
        onProfileClick={() => setLocation("/profile")}
        onSearchChange={(query) => console.log("Search:", query)}
        showSearch={location === "/" || location === "/admin"}
      />

      <main className={cn("container mx-auto px-4 py-4", !isAdmin && "pb-20")}>
        <Switch>
          <Route path="/">
            {isAdmin ? (
              <AdminDashboard />
            ) : (
              <Dashboard
                onItemClick={(item) => {
                  setSelectedItem(item);
                  setLocation("/item");
                }}
                onReportClick={() => setLocation("/report")}
              />
            )}
          </Route>

          <Route path="/search">
            <SearchPage
              onBack={() => setLocation("/")}
              onItemClick={(item) => {
                setSelectedItem(item);
                setLocation("/item");
              }}
            />
          </Route>

          <Route path="/item">
            {selectedItem ? (
              <ItemDetailPage
                item={selectedItem}
                onBack={() => {
                  setSelectedItem(null);
                  setLocation("/");
                }}
                onMessage={() => setLocation("/messages")}
                onClaimSuccess={() => {
                  console.log("Claim submitted successfully");
                }}
              />
            ) : (
              <ItemDetailPage
                item={mockItem}
                onBack={() => setLocation("/")}
                onMessage={() => setLocation("/messages")}
              />
            )}
          </Route>

          <Route path="/report">
            <ReportItemPage
              onBack={() => setLocation("/")}
              onSuccess={() => setLocation("/")}
            />
          </Route>

          <Route path="/claims">
            <ClaimsPage onBack={() => setLocation("/")} />
          </Route>

          <Route path="/messages">
            <MessagesPage onBack={() => setLocation("/")} />
          </Route>

          <Route path="/notifications">
            <NotificationsPage
              onBack={() => setLocation("/")}
              onNotificationClick={(notification) => {
                if (notification.relatedItemId) {
                  setLocation("/item");
                }
              }}
            />
          </Route>

          <Route path="/profile">
            <ProfilePage
              onBack={() => setLocation("/")}
              onLogout={() => setLocation("/")}
              onSettings={() => setLocation("/settings")}
              onStatistics={() => setLocation("/statistics")}
            />
          </Route>

          <Route path="/settings">
            <SettingsPage onBack={() => setLocation("/profile")} />
          </Route>

          <Route path="/statistics">
            <StatisticsPage onBack={() => setLocation("/")} />
          </Route>

          <Route path="/admin">
            <AdminDashboard />
          </Route>

          <Route>
            <Dashboard
              onItemClick={(item) => {
                setSelectedItem(item);
                setLocation("/item");
              }}
              onReportClick={() => setLocation("/report")}
            />
          </Route>
        </Switch>
      </main>

      {!isAdmin && (
        <BottomNavigation
          activeItem={activeNav}
          onItemClick={handleNavClick}
          messageCount={1}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
