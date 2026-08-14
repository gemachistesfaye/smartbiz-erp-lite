import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          <div className="rounded-full bg-amber-50 p-4">
            <WifiOff className="h-10 w-10 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">You're Offline</h2>
            <p className="text-sm text-muted-foreground">
              Some SmartBiz data may be unavailable because it has not been cached yet.
              Reconnect to the internet and try again.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Cached data (products, customers, inventory) is still available for viewing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
