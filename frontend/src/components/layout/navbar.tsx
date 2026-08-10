import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, Moon, Sun, Bell, Search, LogOut, User, ChevronDown, Shield, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { ROLE_LABELS } from '@/lib/constants';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const { user } = useAuthStore();
  const logout = useLogout();
  const [searchQuery, setSearchQuery] = useState('');

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  return (
    <TooltipProvider>
      <header
        className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6"
        role="banner"
      >
        {/* Left zone: Mobile menu + Branding */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <Store className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">SmartBiz</span>
          </Link>
        </div>

        {/* Center zone: Search */}
        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, customers, sales..."
            className="pl-9 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
        </div>

        {/* Right zone: Status, Notifications, Theme, Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Online/Offline Status */}
          <Badge variant={isOnline ? 'default' : 'destructive'} className="hidden sm:inline-flex">
            {isOnline ? 'Online' : 'Offline'}
          </Badge>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</TooltipContent>
          </Tooltip>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user?.email
                        ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`
                        : undefined
                    }
                    alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium leading-tight">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {user?.role ? ROLE_LABELS[user.role] : 'Role'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-[280px] p-1.5">
              <DropdownMenuLabel className="px-3 py-2.5">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-tight">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">{user?.email}</p>
                  <p className="text-xs text-muted-foreground/70 leading-tight">
                    {user?.role ? ROLE_LABELS[user.role] : 'Role'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="px-3 py-2 cursor-pointer">
                <Link to="/profile" className="flex items-center gap-2.5">
                  <User className="h-4 w-4 shrink-0" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="px-3 py-2 cursor-pointer">
                <Link to="/profile" className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 shrink-0" />
                  Account Security
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout.mutate()}
                className="px-3 py-2 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2.5 h-4 w-4 shrink-0" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
