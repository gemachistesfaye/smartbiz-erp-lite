import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex flex-col items-center text-center">
        <ShieldX className="h-20 w-20 text-destructive mb-4" />
        <h1 className="text-6xl font-bold text-muted-foreground">403</h1>
        <h2 className="text-xl font-semibold mt-4">Access Denied</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          You don't have permission to access this page. Please contact your administrator.
        </p>
      </div>
      <Button asChild size="lg">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
