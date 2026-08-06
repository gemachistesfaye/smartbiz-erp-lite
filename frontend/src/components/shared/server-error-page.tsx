import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';

interface ServerErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

export function ServerErrorPage({
  message = 'Something went wrong on our end. Please try again later.',
  onRetry,
}: ServerErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex flex-col items-center text-center">
        <ServerCrash className="h-20 w-20 text-destructive mb-4" />
        <h1 className="text-6xl font-bold text-muted-foreground">500</h1>
        <h2 className="text-xl font-semibold mt-4">Server Error</h2>
        <p className="text-muted-foreground mt-2 max-w-md">{message}</p>
      </div>
      <div className="flex gap-3">
        {onRetry && (
          <Button variant="outline" size="lg" onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Button asChild size="lg">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
