import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';

export function DashboardPage() {
  const { setAuth, user } = useAuthStore();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      setAuth(
        currentUser,
        useAuthStore.getState().token || '',
        useAuthStore.getState().refreshToken || '',
      );
    }
  }, [currentUser, setAuth]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && (
        <p className="text-muted-foreground mt-2">
          Welcome, {user.firstName} {user.lastName}
        </p>
      )}
    </div>
  );
}
