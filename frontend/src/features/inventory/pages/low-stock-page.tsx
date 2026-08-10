import { useLowStock, useOutOfStock } from '../hooks/use-inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, XCircle } from 'lucide-react';

export function LowStockPage() {
  const { data: lowStockData, isLoading: lowStockLoading } = useLowStock();
  const { data: outOfStockData, isLoading: outOfStockLoading } = useOutOfStock();

  const lowStock = lowStockData || [];
  const outOfStock = outOfStockData || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Low Stock Alerts</h1>
        <p className="text-muted-foreground">Products that need attention</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Out of Stock ({outOfStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStockLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : outOfStock.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No products out of stock</p>
            ) : (
              <div className="space-y-2">
                {outOfStock.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2 rounded-md bg-destructive/5 border border-destructive/10">
                    <div>
                      <p className="font-medium">{inv.product?.name}</p>
                      {inv.product?.sku && <p className="text-xs text-muted-foreground">SKU: {inv.product.sku}</p>}
                    </div>
                    <Badge variant="destructive">0 units</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              Low Stock ({lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No products low on stock</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2 rounded-md bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800/30">
                    <div>
                      <p className="font-medium">{inv.product?.name}</p>
                      {inv.product?.sku && <p className="text-xs text-muted-foreground">SKU: {inv.product.sku}</p>}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {inv.quantity} / {inv.minThreshold} min
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
