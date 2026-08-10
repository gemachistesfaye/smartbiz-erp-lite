import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Package, AlertTriangle, XCircle, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventoryList, useInventoryStats } from '../hooks/use-inventory';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function InventoryList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stockStatusFilter, setStockStatusFilter] = useState('');

  const { data, isLoading } = useInventoryList({
    search,
    stockStatus: stockStatusFilter || undefined,
    page,
    limit: 20,
  });

  const { data: stats } = useInventoryStats();
  const inventories = data?.data || [];

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">Low Stock</Badge>;
      case 'overstock':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Overstock</Badge>;
      default:
        return <Badge variant="default">In Stock</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">Track stock levels and inventory value</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={stockStatusFilter || 'all'} onValueChange={(v) => { setStockStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Status</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inventories.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No inventory records</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Receive stock to start tracking inventory.
          </p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantity</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Available</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Reserved</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Avg Cost</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Value</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={8} className="p-4"><Skeleton className="h-8 w-full" /></td>
                  </tr>
                ))
              ) : inventories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center text-muted-foreground">No inventory found.</td>
                </tr>
              ) : (
                inventories.map((inv) => (
                  <tr key={inv.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{inv.product?.name}</p>
                        {inv.product?.sku && <p className="text-xs text-muted-foreground">SKU: {inv.product.sku}</p>}
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">{formatNumber(inv.quantity)}</td>
                    <td className="p-4 text-right">{formatNumber(inv.availableQuantity || inv.quantity - inv.reservedQuantity)}</td>
                    <td className="p-4 text-right">{formatNumber(inv.reservedQuantity)}</td>
                    <td className="p-4 text-right">{formatCurrency(Number(inv.averageCost))}</td>
                    <td className="p-4 text-right font-medium">{formatCurrency(Number(inv.inventoryValue))}</td>
                    <td className="p-4 text-center">
                      {getStockStatusBadge(inv.stockStatus || 'in_stock')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/products/$productId`} params={{ productId: inv.productId }}>
                          <Button variant="ghost" size="sm">View Product</Button>
                        </Link>
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
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} items)
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
