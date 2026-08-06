import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { ROLE_LABELS } from '@/lib/constants';

export function ProfilePage() {
  const { user } = useAuthStore();

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage
              src={user?.email ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff&size=128` : undefined}
              alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
            />
            <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.role ? ROLE_LABELS[user.role] : 'Role'}
          </p>
          <p className="text-muted-foreground mt-8">Profile page coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
