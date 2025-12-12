import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// todo: remove mock functionality
const mockUser: User = {
  id: '1',
  email: 'juan.delacruz@g.msuiit.edu.ph',
  displayName: 'Juan Dela Cruz',
  role: 'student',
  avatarUrl: undefined,
  reputationScore: 42,
  department: 'College of Computer Studies',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    // todo: remove mock functionality - replace with Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
