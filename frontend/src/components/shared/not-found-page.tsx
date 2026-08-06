import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex flex-col items-center text-center">
        <FileQuestion className="h-20 w-20 text-muted-foreground mb-4" />
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild size="lg">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
