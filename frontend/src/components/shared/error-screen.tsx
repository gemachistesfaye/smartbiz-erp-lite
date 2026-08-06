import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message = 'Something went wrong', onRetry }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
