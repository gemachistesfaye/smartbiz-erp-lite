import { useAuthStore } from '@/features/auth/store/auth-store';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
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
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Plus,
  UserPlus,
  PackagePlus,
  FileBarChart,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const kpiData = [
  {
    title: "Today's Sales",
    value: formatCurrency(12450),
    description: '18 transactions today',
    icon: ShoppingCart,
    trend: { value: 12, isPositive: true },
  },
  {
    title: 'Monthly Revenue',
    value: formatCurrency(245800),
    description: 'July 2026',
    icon: DollarSign,
    trend: { value: 8, isPositive: true },
  },
  {
    title: 'Inventory Value',
    value: formatCurrency(892300),
    description: 'Across 245 products',
    icon: Package,
    trend: { value: 3, isPositive: true },
  },
  {
    title: 'Products',
    value: '245',
    description: '12 categories',
    icon: TrendingUp,
    trend: { value: 5, isPositive: true },
  },
  {
    title: 'Low Stock Items',
    value: '18',
    description: 'Need restocking',
    icon: AlertTriangle,
    trend: { value: 2, isPositive: false },
  },
  {
    title: 'Outstanding Credit',
    value: formatCurrency(34200),
    description: '8 customers',
    icon: CreditCard,
    trend: { value: 15, isPositive: false },
  },
];

const recentSales = [
  { id: '1', customer: 'Abebe Kebede', amount: 2450, time: '10 min ago', status: 'completed' },
  { id: '2', customer: 'Fatuma Ahmed', amount: 1200, time: '25 min ago', status: 'completed' },
  { id: '3', customer: 'Dawit Tesfaye', amount: 3800, time: '1 hr ago', status: 'pending' },
  { id: '4', customer: 'Sara Mekonnen', amount: 890, time: '2 hr ago', status: 'completed' },
  { id: '5', customer: 'Yonas Gebre', amount: 5600, time: '3 hr ago', status: 'completed' },
];

const topSellingProducts = [
  { id: '1', name: 'Samsung Galaxy A54', category: 'Electronics', sold: 120, revenue: formatCurrency(180000) },
  { id: '2', name: 'Injera Flour (25kg)', category: 'Groceries', sold: 98, revenue: formatCurrency(24500) },
  { id: '3', name: 'Hawii Shirt', category: 'Clothing', sold: 86, revenue: formatCurrency(17200) },
  { id: '4', name: 'Notebook Pack', category: 'Stationery', sold: 72, revenue: formatCurrency(3600) },
  { id: '5', name: 'Ethiopian Coffee (1kg)', category: 'Groceries', sold: 65, revenue: formatCurrency(9750) },
];

const recentActivity = [
  { id: '1', action: 'New sale recorded', target: 'ETB 2,450 - Abebe Kebede', time: '10 minutes ago', type: 'sale' as const },
  { id: '2', action: 'Product added', target: 'Wireless Mouse', time: '30 minutes ago', type: 'product' as const },
  { id: '3', action: 'Customer registered', target: 'Sara Mekonnen', time: '1 hour ago', type: 'customer' as const },
  { id: '4', action: 'Stock received', target: 'Samsung Galaxy A54 (50 units)', time: '2 hours ago', type: 'stock' as const },
  { id: '5', action: 'Expense recorded', target: 'Office Rent - ETB 15,000', time: '3 hours ago', type: 'expense' as const },
  { id: '6', action: 'Sale completed', target: 'ETB 5,600 - Yonas Gebre', time: '4 hours ago', type: 'sale' as const },
];

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const displayName = currentUser?.firstName || user?.firstName || 'User';

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
        {kpiData.map((stat) => (
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
          <SalesTrendChart />
        </ChartCard>

        <ChartCard
          title="Monthly Revenue"
          description="Revenue over the last 7 months"
        >
          <RevenueChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Inventory Distribution"
          description="By category"
        >
          <InventoryDistributionChart />
        </ChartCard>

        <TableCard
          title="Top Selling Products"
          description="Best performers this month"
          viewAllLink="/products"
        >
          <div className="space-y-3">
            {topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{product.revenue}</p>
                  <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </TableCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TableCard
          title="Recent Sales"
          description="Latest transactions"
          viewAllLink="/sales"
        >
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{sale.customer}</p>
                  <p className="text-xs text-muted-foreground">{sale.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(sale.amount)}</p>
                  <Badge
                    variant={sale.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TableCard>

        <TableCard
          title="Recent Activity"
          description="Latest actions in your store"
        >
          <ActivityCard activities={recentActivity} />
        </TableCard>
      </div>
    </div>
  );
}
