import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import {
  useCustomer,
  useCustomerPayments,
  useCustomerCreditHistory,
  useDeleteCustomer,
} from '../hooks/use-customers';
import { CustomerForm } from '../components/customer-form';
import { PaymentForm } from '../components/payment-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { LoadingScreen } from '@/components/shared/loading-screen';
import { ErrorScreen } from '@/components/shared/error-screen';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Pencil,
  Trash2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
} from 'lucide-react';

export function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/dashboard/customers/$customerId' });
  const { data: customer, isLoading, error } = useCustomer(customerId);
  const { data: payments } = useCustomerPayments(customerId);
  const { data: creditHistory } = useCustomerCreditHistory(customerId);
  const deleteCustomer = useDeleteCustomer();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message="Customer not found" />;
  if (!customer) return null;

  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim();
  const paymentList = payments?.data || [];
  const activities = creditHistory?.activities || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
            {customer.phone && (
              <p className="text-muted-foreground">{customer.phone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              customer.status === 'ACTIVE'
                ? 'default'
                : customer.status === 'BLOCKED'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {customer.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowPaymentDialog(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(customer.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  Credit Limit
                </div>
                <p className="mt-1 text-lg font-bold">
                  {customer.creditLimit ? formatCurrency(Number(customer.creditLimit)) : 'None'}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Outstanding
                </div>
                <p className="mt-1 text-lg font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(customer.outstandingBalance)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Total Purchases
                </div>
                <p className="mt-1 text-lg font-bold">
                  {formatCurrency(customer.totalPurchaseAmount)}
                </p>
                <p className="text-xs text-muted-foreground">{customer.totalPurchases} transaction{customer.totalPurchases !== 1 ? 's' : ''}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4" />
                  Total Paid
                </div>
                <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(customer.totalPaid)}
                </p>
              </div>
            </div>
            {customer.availableCredit !== null && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Credit</span>
                  <span className={`font-medium ${customer.availableCredit <= 0 ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
                    {formatCurrency(customer.availableCredit)}
                  </span>
                </div>
              </div>
            )}
            {customer.lastPurchaseDate && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Purchase</span>
                  <span className="font-medium">{formatDate(customer.lastPurchaseDate)}</span>
                </div>
              </div>
            )}
            {customer.lastPaymentDate && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Payment</span>
                  <span className="font-medium">{formatDate(customer.lastPaymentDate)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {paymentList.slice(0, 10).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{formatCurrency(Number(payment.amount))}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.method.replace('_', ' ')} - {formatDate(payment.createdAt)}
                      </p>
                      {payment.reference && (
                        <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
                      )}
                    </div>
                    {payment.user && (
                      <p className="text-xs text-muted-foreground">
                        by {payment.user.firstName} {payment.user.lastName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit History</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No credit activity yet.</p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      {activity.type === 'CREDIT_SALE' ? (
                        <TrendingUp className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500 dark:text-green-400" />
                      )}
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                    <span
                      className={`font-medium ${
                        activity.type === 'CREDIT_SALE' ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {activity.type === 'CREDIT_SALE' ? '+' : '-'} {formatCurrency(activity.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {creditHistory && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Balance</span>
                  <span className="font-bold">{formatCurrency(creditHistory.currentBalance)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={customer}
            onSuccess={() => setShowEditDialog(false)}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <PaymentForm
            customerId={customerId}
            outstandingBalance={customer.outstandingBalance}
            onSuccess={() => setShowPaymentDialog(false)}
            onCancel={() => setShowPaymentDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{fullName}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteCustomer.mutate(customerId);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
