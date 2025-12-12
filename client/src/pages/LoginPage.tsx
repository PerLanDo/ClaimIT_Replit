import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/generated_images/claimit_app_logo_design.png";

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<
    "student" | "faculty" | "staff" | "sid_admin"
  >("student");
  const [department, setDepartment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        await login(email);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
      } else {
        await register(email, fullName, role, department || undefined);
        toast({
          title: "Account created!",
          description: "Welcome to ClaimIT",
        });
      }
      onLoginSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Quick login for testing with seed data
  const quickLogin = async (testEmail: string) => {
    setEmail(testEmail);
    try {
      await login(testEmail);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      onLoginSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl backdrop-blur-sm bg-card/95 relative z-10">
        <div className="text-center space-y-4">
          <div className="mx-auto w-48 h-auto">
            <img
              src={logoImage}
              alt="ClaimIT Logo"
              className="w-full h-auto object-contain animate-in fade-in duration-500"
            />
          </div>

          <div className="animate-in slide-in-from-bottom duration-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ClaimIT
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              MSU-IIT Campus Lost & Found System
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMode("login")}
          >
            Login
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMode("register")}
          >
            Register
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@g.msuiit.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v: any) => setRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="sid_admin">SID Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-semibold py-6 text-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0"
            data-testid="button-login"
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
              ? "Sign in with My.IIT"
              : "Create Account"}
          </Button>
        </form>

        <div className="space-y-2 pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Quick test login:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => quickLogin("juan.delacruz@g.msuiit.edu.ph")}
              disabled={isLoading}
            >
              Student
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => quickLogin("prof.rodriguez@g.msuiit.edu.ph")}
              disabled={isLoading}
            >
              Faculty
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => quickLogin("admin.sid@msuiit.edu.ph")}
              disabled={isLoading}
            >
              SID Admin
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Managed by SID & ICTC
        </p>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
        MSU-IIT Mindanao State University - Iligan Institute of Technology
      </p>
    </div>
  );
}
