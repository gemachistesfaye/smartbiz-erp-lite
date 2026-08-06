import { Warehouse } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Track stock levels and movements</p>
        </div>
        <Button>
          <Warehouse className="mr-2 h-4 w-4" />
          Receive Stock
        </Button>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Warehouse className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Inventory management coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
