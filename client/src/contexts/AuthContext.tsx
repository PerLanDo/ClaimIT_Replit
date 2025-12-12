import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (
    email: string,
    fullName: string,
    role?: string,
    department?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("claimit_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          // Convert date strings back to Date objects if needed
          createdAt: userData.createdAt
            ? new Date(userData.createdAt)
            : new Date(),
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("claimit_user");
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (
    email: string,
    fullName: string,
    role: string = "student",
    department?: string
  ) => {
    setIsLoading(true);
    try {
      // Import dynamically to avoid circular dependencies
      const { createUser } = await import("@/lib/firebaseService");
      
      const newUser = await createUser({
        email,
        fullName,
        role,
        department,
      });

      setUser(newUser);
      localStorage.setItem("claimit_user", JSON.stringify(newUser));
      localStorage.setItem("claimit_user_id", newUser.id);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      // Import dynamically to avoid circular dependencies
      const { getUserByEmail } = await import("@/lib/firebaseService");
      
      const existingUser = await getUserByEmail(email);
      
      if (!existingUser) {
        throw new Error("User not found. Please register first.");
      }

      setUser(existingUser);
      localStorage.setItem("claimit_user", JSON.stringify(existingUser));
      localStorage.setItem("claimit_user_id", existingUser.id);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("claimit_user");
    localStorage.removeItem("claimit_user_id");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
