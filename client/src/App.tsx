import { useState } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { ReportItemPage } from '@/pages/ReportItemPage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';
import { ClaimsPage } from '@/pages/ClaimsPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import type { Item } from '@/lib/types';

// todo: remove mock functionality
const mockItem: Item = {
  id: '1',
  title: 'Blue iPhone 14 Pro',
  description: 'Found near CCS building entrance. The phone is in good condition with a blue case. Screen protector is intact. Found it on the bench near the entrance.',
  category: 'electronics',
  status: 'found',
  type: 'found',
  location: 'CCS Building',
  date: new Date('2024-12-10'),
  photos: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
  ],
  reporterId: '2',
  reporterName: 'Maria Santos',
  turnoverToSID: true,
  createdAt: new Date('2024-12-10'),
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState<'home' | 'search' | 'report' | 'messages' | 'profile'>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleNavClick = (item: typeof activeNav) => {
    setActiveNav(item);
    switch (item) {
      case 'home':
        setLocation('/');
        break;
      case 'search':
        setLocation('/');
        break;
      case 'report':
        setLocation('/report');
        break;
      case 'messages':
        setLocation('/messages');
        break;
      case 'profile':
        setLocation('/profile');
        break;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setLocation('/')} />;
  }

  const isAdmin = user?.role === 'sid_admin';

  return (
    <div className="min-h-screen bg-background">
      <Header
        notificationCount={2}
        onNotificationClick={() => setLocation('/notifications')}
        onProfileClick={() => setLocation('/profile')}
        onSearchChange={(query) => console.log('Search:', query)}
        showSearch={location === '/' || location === '/admin'}
      />

      <main className="container mx-auto px-4 py-4">
        <Switch>
          <Route path="/">
            {isAdmin ? (
              <AdminDashboard />
            ) : (
              <Dashboard
                onItemClick={(item) => {
                  setSelectedItem(item);
                  setLocation('/item');
                }}
                onReportClick={() => setLocation('/report')}
              />
            )}
          </Route>

          <Route path="/item">
            {selectedItem ? (
              <ItemDetailPage
                item={selectedItem}
                onBack={() => {
                  setSelectedItem(null);
                  setLocation('/');
                }}
                onMessage={() => setLocation('/messages')}
                onClaimSuccess={() => {
                  console.log('Claim submitted successfully');
                }}
              />
            ) : (
              <ItemDetailPage
                item={mockItem}
                onBack={() => setLocation('/')}
                onMessage={() => setLocation('/messages')}
              />
            )}
          </Route>

          <Route path="/report">
            <ReportItemPage
              onBack={() => setLocation('/')}
              onSuccess={() => setLocation('/')}
            />
          </Route>

          <Route path="/claims">
            <ClaimsPage />
          </Route>

          <Route path="/messages">
            <MessagesPage />
          </Route>

          <Route path="/notifications">
            <NotificationsPage
              onNotificationClick={(notification) => {
                if (notification.itemId) {
                  setLocation('/item');
                }
              }}
            />
          </Route>

          <Route path="/profile">
            <ProfilePage onLogout={() => setLocation('/')} />
          </Route>

          <Route path="/admin">
            <AdminDashboard />
          </Route>

          <Route>
            <Dashboard
              onItemClick={(item) => {
                setSelectedItem(item);
                setLocation('/item');
              }}
              onReportClick={() => setLocation('/report')}
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
