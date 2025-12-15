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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, role, department }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const { user: newUser } = await response.json();

      // Convert date strings to Date objects
      const userData = {
        ...newUser,
        createdAt: new Date(newUser.createdAt),
      };

      setUser(userData);
      localStorage.setItem("claimit_user", JSON.stringify(userData));
      localStorage.setItem("claimit_user_id", userData.id);
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const { user: existingUser } = await response.json();

      // Convert date strings to Date objects
      const userData = {
        ...existingUser,
        createdAt: new Date(existingUser.createdAt),
      };

      setUser(userData);
      localStorage.setItem("claimit_user", JSON.stringify(userData));
      localStorage.setItem("claimit_user_id", userData.id);
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
