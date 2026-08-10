import { useState } from 'react';
import { Package, XCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStockReceivings, useCancelReceiving } from '@/features/inventory/hooks/use-inventory';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { StockReceiving } from '@/types/models';

export function StockReceivingList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingReceiving, setCancellingReceiving] = useState<StockReceiving | null>(null);

  const { data, isLoading } = useStockReceivings({
    search,
    status: statusFilter || undefined,
    page,
    limit: 20,
  });

  const cancelReceiving = useCancelReceiving();
  const receivings = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return <Badge variant="default">Received</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search receivings..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {receivings.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No stock receivings</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Stock receiving records will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supplier</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Items</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total Cost</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={7} className="p-4"><Skeleton className="h-8 w-full" /></td>
                  </tr>
                ))
              ) : receivings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-24 text-center text-muted-foreground">No receivings found.</td>
                </tr>
              ) : (
                receivings.map((rec) => (
                  <tr key={rec.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 font-medium">{rec.purchaseReference || rec.id.slice(0, 8)}</td>
                    <td className="p-4 text-muted-foreground">{rec.supplier?.name || '-'}</td>
                    <td className="p-4 text-muted-foreground">{formatDateTime(rec.date)}</td>
                    <td className="p-4 text-center">{rec.items?.length || 0}</td>
                    <td className="p-4 text-right font-medium">{formatCurrency(Number(rec.totalCost))}</td>
                    <td className="p-4 text-center">{getStatusBadge(rec.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {rec.status !== 'CANCELLED' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCancellingReceiving(rec)}
                            aria-label="Cancel receiving"
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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

      <AlertDialog open={!!cancellingReceiving} onOpenChange={(open) => !open && setCancellingReceiving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Stock Receiving</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this stock receiving? This will reverse the inventory changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancellingReceiving) {
                  cancelReceiving.mutate(cancellingReceiving.id, {
                    onSuccess: () => setCancellingReceiving(null),
                  });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, cancel it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
