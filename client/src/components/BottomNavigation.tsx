import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = 'home' | 'search' | 'report' | 'messages' | 'profile';

interface BottomNavigationProps {
  activeItem: NavItem;
  onItemClick: (item: NavItem) => void;
  messageCount?: number;
}

export function BottomNavigation({ activeItem, onItemClick, messageCount = 0 }: BottomNavigationProps) {
  const navItems: { id: NavItem; icon: typeof Home; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'report', icon: PlusCircle, label: 'Report' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isReport = item.id === 'report';

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative",
                isReport 
                  ? "bg-primary text-primary-foreground -mt-4 rounded-full p-3 shadow-lg"
                  : isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover-elevate"
              )}
              data-testid={`nav-${item.id}`}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isReport && "h-6 w-6")} />
                {item.id === 'messages' && messageCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {messageCount > 9 ? '9+' : messageCount}
                  </span>
                )}
              </div>
              {!isReport && (
                <span className={cn(
                  "text-xs",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
