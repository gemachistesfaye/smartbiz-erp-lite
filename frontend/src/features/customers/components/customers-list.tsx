import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Pencil, Trash2, Eye, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { CustomerForm } from './customer-form';
import { PaymentForm } from './payment-form';
import { useCustomers, useDeleteCustomer, useCustomer } from '../hooks/use-customers';
import type { Customer } from '@/types/models';

export function CustomersList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);

  const { data, isLoading } = useCustomers({
    search,
    status: statusFilter || undefined,
    page,
    limit: 20,
  });

  const deleteCustomer = useDeleteCustomer();
  const customers = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {customers.length === 0 && !isLoading && !search && !statusFilter ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No customers yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first customer to start managing your customer relationships.
          </p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Credit Limit</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Balance</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={7} className="p-4"><div className="h-8 bg-muted animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-24 text-center text-muted-foreground">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {customer.firstName} {customer.lastName || ''}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{customer.phone || '-'}</td>
                    <td className="p-4 text-muted-foreground">{customer.email || '-'}</td>
                    <td className="p-4 text-right text-muted-foreground">
                      {customer.creditLimit ? `Br ${Number(customer.creditLimit).toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {customer.creditBalance > 0 ? (
                        <span className="font-medium text-orange-600">
                          Br {Number(customer.creditBalance).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
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
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/customers/$customerId`} params={{ customerId: customer.id }}>
                          <Button variant="ghost" size="icon" aria-label="View customer">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPaymentCustomer(customer)}
                          aria-label="Record payment"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCustomer(customer)}
                          aria-label="Edit customer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCustomer(customer)}
                          aria-label="Delete customer"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} customers)
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

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm onSuccess={() => setShowCreateDialog(false)} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm
              customer={editingCustomer}
              onSuccess={() => setEditingCustomer(null)}
              onCancel={() => setEditingCustomer(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!paymentCustomer} onOpenChange={(open) => !open && setPaymentCustomer(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {paymentCustomer && (
            <PaymentCustomerWrapper
              customerId={paymentCustomer.id}
              onSuccess={() => setPaymentCustomer(null)}
              onCancel={() => setPaymentCustomer(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCustomer?.firstName} {deletingCustomer?.lastName}&quot;? This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCustomer) {
                  deleteCustomer.mutate(deletingCustomer.id, {
                    onSuccess: () => setDeletingCustomer(null),
                  });
                }
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

function PaymentCustomerWrapper({
  customerId,
  onSuccess,
  onCancel,
}: {
  customerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { data: customer } = useCustomer(customerId);
  if (!customer) return null;
  return (
    <PaymentForm
      customerId={customerId}
      outstandingBalance={customer.outstandingBalance}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}
