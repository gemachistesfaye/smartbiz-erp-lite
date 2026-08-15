import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Loader2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useSale, useCancelSale } from '../hooks/use-sales';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { Invoice } from '@/components/shared/invoice';
import { formatCurrency } from '@/lib/utils';

export function SaleDetailPage() {
  const { saleId } = useParams({ strict: false }) as { saleId: string };
  const { data: sale, isLoading } = useSale(saleId);
  const { data: currentUser } = useCurrentUser();
  const cancelSale = useCancelSale();
  const [open, setOpen] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="space-y-6">
        <Link to="/sales">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sales
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold">Sale not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The sale you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (sale.status) {
      case 'VOIDED':
        return <Badge variant="destructive">VOIDED</Badge>;
      case 'REFUNDED':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">REFUNDED</Badge>;
      default:
        return <Badge variant="default">COMPLETED</Badge>;
    }
  };

  const canCancel = sale.status === 'COMPLETED' && currentUser?.role && ['OWNER', 'MANAGER'].includes(currentUser.role);

  const handleCancel = () => {
    cancelSale.mutate(sale.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/sales">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sales
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{sale.saleNumber}</h1>
            <div className="mt-1">{getStatusBadge()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowInvoiceDialog(true)}>
            <FileDown className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          {canCancel && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Sale</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will void sale {sale.saleNumber}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} disabled={cancelSale.isPending}>
                    {cancelSale.isPending ? 'Cancelling...' : 'Yes, Cancel Sale'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sale Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(sale.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">
                  {sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName || ''}`.trim() : 'Walk-in'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cashier</p>
                <p className="font-medium">
                  {sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName}`.trim() : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{sale.paymentMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatCurrency(sale.subtotal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tax</p>
                <p className="font-medium">{formatCurrency(sale.taxAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discount</p>
                <p className="font-medium">{formatCurrency(sale.discountAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{formatCurrency(sale.totalAmount)}</p>
              </div>
              {sale.amountTendered !== undefined && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Tendered</p>
                    <p className="font-medium">{formatCurrency(sale.amountTendered)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Change</p>
                    <p className="font-medium">{formatCurrency(sale.changeAmount || 0)}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantity</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Unit Price</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        {item.product?.sku && <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>}
                      </div>
                    </td>
                    <td className="p-4 text-right">{item.quantity}</td>
                    <td className="p-4 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-4 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice - {sale.saleNumber}</DialogTitle>
          </DialogHeader>
          <Invoice sale={sale} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
