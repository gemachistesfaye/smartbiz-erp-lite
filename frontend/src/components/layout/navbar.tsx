import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Menu,
  Moon,
  Sun,
  Monitor,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Store,
  Download,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/use-theme';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { ROLE_LABELS } from '@/lib/constants';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { ConnectivityStatus } from '@/components/shared/connectivity-status';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/customers/hooks/use-overdue';
import { formatDate } from '@/lib/utils';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const { user } = useAuthStore();
  const logout = useLogout();
  const [searchQuery, setSearchQuery] = useState('');
  const { isInstallable, promptInstall } = usePwaInstall();
  const { data: unreadData } = useUnreadNotificationCount();
  const { data: notificationsData } = useNotifications({ limit: 5 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = unreadData?.count || 0;
  const notifications = notificationsData?.data || [];

  const userInitials =
    user && user.firstName
      ? `${user.firstName[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
      : null;

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
          {/* Connectivity Status */}
          <div>
            <ConnectivityStatus />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-[10px] px-1"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-[360px]">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => markAllRead.mutate()}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer ${
                      !notification.read ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) markRead.mutate(notification.id);
                    }}
                  >
                    <div className="flex items-start gap-2 w-full">
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{notification.title}</p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Change theme">
                    {theme === 'dark' && <Moon className="h-5 w-5" />}
                    {theme === 'light' && <Sun className="h-5 w-5" />}
                    {theme === 'system' && <Monitor className="h-5 w-5" />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Theme</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Install App Icon */}
          {isInstallable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Install App"
                  onClick={promptInstall}
                >
                  <Download className="h-5 w-5 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Install SmartBiz</TooltipContent>
            </Tooltip>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={
                      user?.email
                        ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`
                        : undefined
                    }
                    alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
                  />
                  <AvatarFallback className="bg-muted">
                    {userInitials ? (
                      userInitials
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </AvatarFallback>
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
