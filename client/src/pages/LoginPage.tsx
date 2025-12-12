import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import logoImage from '@assets/generated_images/claimit_app_logo_design.png';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login();
    onLoginSuccess?.();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full border-4 border-primary p-2 bg-white">
            <img 
              src={logoImage} 
              alt="ClaimIT Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-primary">ClaimIT</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Campus Lost & Found System
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Report, search, and recover lost items on campus
          </p>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-semibold py-6"
            data-testid="button-login"
          >
            {isLoading ? 'Signing in...' : 'Sign in with My.IIT'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Managed by SID & ICTC
        </p>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
        MSU-IIT Mindanao State University - Iligan Institute of Technology
      </p>
    </div>
  );
}
