import { Header } from '../Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Header
          notificationCount={3}
          onMenuClick={() => console.log('Menu clicked')}
          onNotificationClick={() => console.log('Notifications clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onSearchChange={(query) => console.log('Search:', query)}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
