import { useLowStock, useOutOfStock } from '../hooks/use-inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle } from 'lucide-react';

export function LowStockPage() {
  const { data: lowStockData } = useLowStock();
  const { data: outOfStockData } = useOutOfStock();

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
            {outOfStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products out of stock</p>
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
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Low Stock ({lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products low on stock</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2 rounded-md bg-yellow-50 border border-yellow-200">
                    <div>
                      <p className="font-medium">{inv.product?.name}</p>
                      {inv.product?.sku && <p className="text-xs text-muted-foreground">SKU: {inv.product.sku}</p>}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
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
