import { useAuthStore } from '@/features/auth/store/auth-store';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { TableCard } from '@/components/dashboard/table-card';
import { ActivityCard } from '@/components/dashboard/activity-card';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import {
  SalesTrendChart,
  RevenueChart,
  InventoryDistributionChart,
} from '@/components/dashboard/charts';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  CreditCard,
  Plus,
  UserPlus,
  PackagePlus,
  FileBarChart,
  Users,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

function KpiSkeleton() {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[300px] w-full" />;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, error } = useDashboard();
  const navigate = useNavigate();

  const displayName = currentUser?.firstName || user?.firstName || 'User';

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Unable to load dashboard data. Please try again later.
          </p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-2">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">
              Check your connection and try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overview = data?.overview;

  const kpiData = isLoading
    ? []
    : [
        {
          title: "Today's Sales",
          value: formatCurrency(overview?.todaySales || 0),
          description: `${overview?.todaySaleCount || 0} transactions today`,
          icon: ShoppingCart,
          trend: undefined as { value: number; isPositive: boolean } | undefined,
        },
        {
          title: 'Monthly Revenue',
          value: formatCurrency(overview?.monthlyRevenue || 0),
          description: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          icon: DollarSign,
          trend: overview?.revenueTrend
            ? { value: Math.abs(overview.revenueTrend), isPositive: overview.revenueTrend >= 0 }
            : undefined,
        },
        {
          title: 'Total Products',
          value: String(overview?.totalProducts || 0),
          description: 'Active products',
          icon: Package,
          trend: undefined,
        },
        {
          title: 'Low Stock Items',
          value: String(overview?.lowStockProducts || 0),
          description: 'Need restocking',
          icon: AlertTriangle,
          trend: overview?.lowStockProducts
            ? { value: overview.lowStockProducts, isPositive: false }
            : undefined,
        },
        {
          title: 'Total Customers',
          value: String(overview?.totalCustomers || 0),
          description: 'Registered customers',
          icon: Users,
          trend: undefined,
        },
        {
          title: 'Outstanding Credit',
          value: formatCurrency(overview?.outstandingCredit || 0),
          description: data?.customerCreditSummary
            ? `${data.customerCreditSummary.customerCount} customers`
            : '0 customers',
          icon: CreditCard,
          trend: overview?.outstandingCredit
            ? { value: 0, isPositive: false }
            : undefined,
        },
      ];

  const salesTrendData = data?.salesTrend?.map((d) => ({
    name: d.day,
    sales: d.sales,
    expenses: d.expenses,
  })) || [];

  const monthlyRevenueData = (() => {
    if (!data?.salesTrend?.length) return [];
    const monthlyMap = new Map<string, number>();
    data.salesTrend.forEach((d) => {
      const monthKey = d.date.slice(0, 7);
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + d.sales);
    });
    return Array.from(monthlyMap.entries()).map(([key, value]) => {
      const [y, m] = key.split('-');
      const monthName = new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short' });
      return { name: monthName, revenue: value };
    });
  })();

  const inventoryChartData = data?.inventorySummary?.map((c) => ({
    name: c.name,
    value: c.totalStock,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpiData.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionCard
            label="New Sale"
            icon={Plus}
            onClick={() => navigate({ to: '/sales' })}
          />
          <QuickActionCard
            label="Add Product"
            icon={PackagePlus}
            onClick={() => navigate({ to: '/products' })}
          />
          <QuickActionCard
            label="Add Customer"
            icon={UserPlus}
            onClick={() => navigate({ to: '/customers' })}
          />
          <QuickActionCard
            label="Generate Report"
            icon={FileBarChart}
            onClick={() => navigate({ to: '/reports' })}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Sales Trend"
          description="Daily sales vs expenses this week"
        >
          {isLoading ? <ChartSkeleton /> : <SalesTrendChart data={salesTrendData} />}
        </ChartCard>

        <ChartCard
          title="Monthly Revenue"
          description="Revenue over recent months"
        >
          {isLoading ? <ChartSkeleton /> : <RevenueChart data={monthlyRevenueData} />}
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Inventory Distribution"
          description="By category"
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : inventoryChartData.length === 0 ? (
            <EmptyState message="No inventory data yet. Add products to see distribution." />
          ) : (
            <InventoryDistributionChart data={inventoryChartData} />
          )}
        </ChartCard>

        <TableCard
          title="Top Selling Products"
          description="Best performers this month"
          viewAllLink="/products"
        >
          {isLoading ? (
            <TableSkeleton />
          ) : !data?.topSellingProducts?.length ? (
            <EmptyState message="No sales yet. Complete your first sale to see top products." />
          ) : (
            <div className="space-y-3">
              {data.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{product.quantitySold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TableCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TableCard
          title="Recent Sales"
          description="Latest transactions"
          viewAllLink="/sales"
        >
          {isLoading ? (
            <TableSkeleton />
          ) : !data?.recentSales?.length ? (
            <EmptyState message="No sales yet. Start by creating your first sale." />
          ) : (
            <div className="space-y-3">
              {data.recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-md p-1 -m-1 transition-colors"
                  onClick={() => navigate({ to: '/sales/$saleId', params: { saleId: sale.id } })}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{sale.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(sale.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(sale.amount)}</p>
                    <Badge
                      variant={sale.status === 'COMPLETED' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {sale.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TableCard>

        <TableCard
          title="Recent Activity"
          description="Latest actions in your store"
        >
          {isLoading ? (
            <TableSkeleton />
          ) : !data?.activityFeed?.length ? (
            <EmptyState message="No recent activity. Start using the system to see activity here." />
          ) : (
            <ActivityCard activities={data.activityFeed} />
          )}
        </TableCard>
      </div>
    </div>
  );
}
