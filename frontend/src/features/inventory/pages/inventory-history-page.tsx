import { useState } from 'react';
import { useInventoryTransactions } from '../hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDateTime } from '@/lib/utils';
import { History } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  STOCK_IN: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  STOCK_OUT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  ADJUSTMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  DAMAGE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  LOSS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CORRECTION: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  RETURN: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  TRANSFER: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300',
};

export function InventoryHistoryPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useInventoryTransactions({
    type: typeFilter || undefined,
    page,
    limit: 20,
  });

  const transactions = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory History</h1>
        <p className="text-muted-foreground">Complete timeline of all inventory movements</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={typeFilter || 'all'} onValueChange={(v) => { setTypeFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="STOCK_IN">Stock In</SelectItem>
            <SelectItem value="STOCK_OUT">Stock Out</SelectItem>
            <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
            <SelectItem value="DAMAGE">Damage</SelectItem>
            <SelectItem value="LOSS">Loss</SelectItem>
            <SelectItem value="CORRECTION">Correction</SelectItem>
            <SelectItem value="RETURN">Return</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <History className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Inventory movements will appear here as they occur.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{tx.product?.name}</p>
                        {tx.product?.sku && (
                          <span className="text-xs text-muted-foreground">({tx.product.sku})</span>
                        )}
                        <Badge className={TYPE_COLORS[tx.type] || ''}>{tx.type.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tx.reason || 'No reason provided'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tx.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                      {tx.quantity > 0 ? '+' : ''}{tx.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.quantityBefore} → {tx.quantityAfter}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {tx.user?.firstName} {tx.user?.lastName} · {formatDateTime(tx.createdAt)}
                  </p>
                  {tx.referenceType && (
                    <p className="text-xs text-muted-foreground">
                      Ref: {tx.referenceType}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} transactions)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
