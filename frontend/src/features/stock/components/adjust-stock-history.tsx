import { useState } from 'react';
import { useInventoryTransactions } from '@/features/inventory/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export function AdjustStockHistory() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useInventoryTransactions({
    type: typeFilter || undefined,
    page,
    limit: 20,
  });

  const transactions = data?.data || [];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ADJUSTMENT':
        return <Badge variant="secondary">Adjustment</Badge>;
      case 'DAMAGE':
        return <Badge variant="destructive">Damage</Badge>;
      case 'LOSS':
        return <Badge className="bg-orange-100 text-orange-800">Loss</Badge>;
      case 'CORRECTION':
        return <Badge className="bg-blue-100 text-blue-800">Correction</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="">All Types</option>
          <option value="ADJUSTMENT">Adjustment</option>
          <option value="DAMAGE">Damage</option>
          <option value="LOSS">Loss</option>
          <option value="CORRECTION">Correction</option>
        </select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Type</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantity</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Before</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">After</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reason</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={8} className="p-4"><div className="h-8 bg-muted animate-pulse rounded" /></td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="h-24 text-center text-muted-foreground">No adjustments found.</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 text-muted-foreground">{formatDateTime(tx.createdAt)}</td>
                  <td className="p-4">
                    <p className="font-medium">{tx.product?.name}</p>
                    {tx.product?.sku && <p className="text-xs text-muted-foreground">{tx.product.sku}</p>}
                  </td>
                  <td className="p-4 text-center">{getTypeBadge(tx.type)}</td>
                  <td className={`p-4 text-right font-medium ${tx.quantity > 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {tx.quantity > 0 ? '+' : ''}{tx.quantity}
                  </td>
                  <td className="p-4 text-right text-muted-foreground">{tx.quantityBefore}</td>
                  <td className="p-4 text-right font-medium">{tx.quantityAfter}</td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">{tx.reason || '-'}</td>
                  <td className="p-4 text-muted-foreground">{tx.user?.firstName} {tx.user?.lastName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} records)
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
