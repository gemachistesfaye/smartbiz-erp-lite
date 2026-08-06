import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Settings page coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
