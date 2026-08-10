import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Receipt, Plus, DollarSign, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useSales } from '../hooks/use-sales';
import { formatCurrency } from '@/lib/utils';
import { Package } from 'lucide-react';

export function SalesHistoryPage() {
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSales({
    search,
    paymentMethod: paymentMethod || undefined,
    status: status || undefined,
    page,
    limit: 20,
  });

  const sales = data?.data || [];
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const getStatusBadge = (saleStatus: string) => {
    switch (saleStatus) {
      case 'VOIDED':
        return <Badge variant="destructive">VOIDED</Badge>;
      default:
        return <Badge variant="default">COMPLETED</Badge>;
    }
  };

  const getTypeBadge = (method: string) => {
    switch (method) {
      case 'CREDIT':
        return <Badge variant="secondary">Credit</Badge>;
      default:
        return <Badge>Cash</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">View and manage sales transactions</p>
        </div>
        <Link to="/pos">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{data?.meta?.total || sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v === 'all' ? '' : v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Payment Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Methods</SelectItem>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="CREDIT">Credit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="VOIDED">Voided</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sales.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No sales found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start a new sale to see it here.
          </p>
          <Link to="/pos" className="mt-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sale #</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cashier</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={8} className="p-4">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center text-muted-foreground">No sales found.</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 font-medium">{sale.saleNumber}</td>
                    <td className="p-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName || ''}`.trim() : 'Walk-in'}
                    </td>
                    <td className="p-4">{getTypeBadge(sale.paymentMethod)}</td>
                    <td className="p-4 text-right font-medium">{formatCurrency(sale.totalAmount)}</td>
                    <td className="p-4">{getStatusBadge(sale.status)}</td>
                    <td className="p-4">
                      {sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName}`.trim() : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to="/sales/$saleId" params={{ saleId: sale.id }}>
                          <Button variant="ghost" size="sm">View</Button>
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
