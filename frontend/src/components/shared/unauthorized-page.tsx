import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ShieldX className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="text-muted-foreground">You do not have permission to access this page.</p>
      <Button asChild>
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
