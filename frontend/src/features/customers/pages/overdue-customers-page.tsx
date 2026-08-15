import { useTranslation } from 'react-i18next';
import { useOverdueCustomers, useSendOverdueReminder, type OverdueCustomer } from '../hooks/use-overdue';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import {
  AlertTriangle,
  DollarSign,
  Users,
  Clock,
  Bell,
  BellRing,
} from 'lucide-react';
import toast from 'react-hot-toast';

function StatSkeleton() {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-11 w-11 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28" />
        </div>
      ))}
    </div>
  );
}

export function OverdueCustomersPage() {
  const { t } = useTranslation();
  const { data: overdueCustomers, isLoading } = useOverdueCustomers();
  const sendReminder = useSendOverdueReminder();

  const customers = overdueCustomers || [];

  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
  const avgDaysOverdue =
    customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + (c.daysOverdue || 0), 0) / customers.length)
      : 0;

  const handleSendReminder = async (customer: OverdueCustomer) => {
    try {
      await sendReminder.mutateAsync(customer.id);
      toast.success(t('overdue.reminderSent'));
    } catch {
      toast.error(t('overdue.reminderFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('overdue.title')}</h1>
        <p className="text-muted-foreground">{t('overdue.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : (
            <>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('overdue.totalOutstanding')}</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
                    </div>
                    <div className="rounded-lg bg-destructive/10 p-2.5">
                      <DollarSign className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('overdue.customersWithDebt')}</p>
                      <p className="text-2xl font-bold">{customers.length}</p>
                    </div>
                    <div className="rounded-lg bg-orange-500/10 p-2.5">
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('overdue.averageDaysOverdue')}</p>
                      <p className="text-2xl font-bold">{avgDaysOverdue}</p>
                    </div>
                    <div className="rounded-lg bg-yellow-500/10 p-2.5">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('overdue.title')}
          </CardTitle>
          <CardDescription>{customers.length} {t('overdue.customersWithDebt').toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">{t('overdue.noOverdueCustomers')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('overdue.allCaughtUp')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('overdue.customerName')}</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">{t('overdue.phone')}</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">{t('overdue.outstandingBalance')}</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">{t('overdue.dueDate')}</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">{t('overdue.daysOverdue')}</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">{t('overdue.status')}</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">{t('overdue.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="font-medium">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {customer.phone || '-'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant="destructive" className="font-mono">
                          {formatCurrency(customer.outstandingBalance)}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {customer.dueDate
                          ? new Date(customer.dueDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant={customer.daysOverdue > 30 ? 'destructive' : 'outline'}>
                          {t('overdue.overdueBy', { days: customer.daysOverdue })}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant={customer.daysOverdue > 0 ? 'destructive' : 'default'}>
                          {customer.daysOverdue > 0 ? 'Overdue' : t('overdue.notYetDue')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(customer)}
                          disabled={sendReminder.isPending}
                          className="gap-1.5"
                        >
                          <BellRing className="h-3.5 w-3.5" />
                          {t('overdue.sendReminder')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
