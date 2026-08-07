import { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Receipt,
  CreditCard,
  BarChart,
  PieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  useOverviewReport,
  useSalesReport,
  useInventoryReport,
  useCustomerCreditReport,
  useExpenseReport,
  useProfitability,
  type ReportFilters,
} from '../hooks/use-reports';

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
];

const PAYMENT_OPTIONS = [
  { value: 'all', label: 'All methods' },
  { value: 'CASH', label: 'Cash' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
  { value: 'CREDIT', label: 'Credit' },
];

const PIE_COLORS = ['#0D8ABC', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#EC4899'];

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <div className="flex items-center gap-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[300px] w-full" />;
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-full flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function ReportFiltersUI({
  filters,
  setFilters,
  showPayment = false,
}: {
  filters: ReportFilters;
  setFilters: (f: ReportFilters) => void;
  showPayment?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.range || '30d'}
        onValueChange={(v) => setFilters({ ...filters, range: v })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showPayment && (
        <Select
          value={filters.paymentMethod || 'all'}
          onValueChange={(v) => setFilters({ ...filters, paymentMethod: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────

function OverviewTab({ filters }: { filters: ReportFilters }) {
  const { data, isLoading, error } = useOverviewReport(filters);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-1">Failed to load overview</p>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-7 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Period Revenue" value={formatCurrency(data.periodRevenue)} icon={DollarSign} description={`${data.periodSaleCount} sales`} />
        <StatCard title="Monthly Revenue" value={formatCurrency(data.monthlyRevenue)} icon={BarChart3} trend={data.revenueTrend !== 0 ? { value: Math.abs(data.revenueTrend), isPositive: data.revenueTrend >= 0 } : undefined} />
        <StatCard title="Total Products" value={String(data.totalProducts)} icon={Package} />
        <StatCard title="Low Stock" value={String(data.lowStockProducts)} icon={AlertTriangle} description={`${data.outOfStockProducts} out of stock`} />
        <StatCard title="Total Customers" value={String(data.totalCustomers)} icon={Users} />
        <StatCard title="Outstanding Credit" value={formatCurrency(data.outstandingCredit)} icon={CreditCard} />
        <StatCard title="Monthly Expenses" value={formatCurrency(data.totalExpenses)} icon={Receipt} />
        <StatCard title="Estimated Profit" value={formatCurrency(data.estimatedProfit)} icon={TrendingUp} />
      </div>
    </div>
  );
}

// ── Sales Tab ───────────────────────────────────────────

function SalesTab({ filters }: { filters: ReportFilters }) {
  const { data, isLoading, error } = useSalesReport(filters);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-1">Failed to load sales report</p>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-7 w-32" /></CardContent>
            </Card>
          ))}
        </div>
        <Card><CardContent className="p-4"><ChartSkeleton /></CardContent></Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardContent className="p-4"><ChartSkeleton /></CardContent></Card>
          <Card><CardContent className="p-4"><TableSkeleton /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Revenue" value={formatCurrency(data.summary.totalRevenue)} icon={DollarSign} />
        <StatCard title="Transactions" value={String(data.summary.totalSales)} icon={ShoppingCart} />
        <StatCard title="Average Sale" value={formatCurrency(data.summary.averageSale)} icon={BarChart3} />
        <StatCard title="Cash Sales" value={formatCurrency(data.summary.cashSales)} icon={DollarSign} />
        <StatCard title="Credit Sales" value={formatCurrency(data.summary.creditSales)} icon={CreditCard} />
      </div>

      {data.salesTrend.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.salesTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(222.2, 47.4%, 11.2%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(222.2, 47.4%, 11.2%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(222.2, 47.4%, 11.2%)" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {data.categoryBreakdown.length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="revenue"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {data.categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                   <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <EmptyState icon={PieChart} message="No category data for this period" />
            </CardContent>
          </Card>
        )}

        {data.paymentBreakdown.length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.paymentBreakdown.map((p) => (
                  <div key={p.method} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{p.method}</Badge>
                      <span className="text-sm text-muted-foreground">{p.count} sales</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(p.totalRevenue)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <EmptyState icon={CreditCard} message="No payment data for this period" />
            </CardContent>
          </Card>
        )}
      </div>

      {data.topProducts.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(p.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{p.quantitySold} sold ({p.percentageOfSales}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <EmptyState icon={BarChart} message="No product sales for this period" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Inventory Tab ───────────────────────────────────────

function InventoryTab() {
  const { data, isLoading, error } = useInventoryReport();

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-1">Failed to load inventory report</p>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-7 w-32" /></CardContent>
            </Card>
          ))}
        </div>
        <Card><CardContent className="p-4"><TableSkeleton rows={8} /></CardContent></Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={String(data.summary.totalProducts)} icon={Package} />
        <StatCard title="Total Stock" value={formatNumber(data.summary.totalStockQuantity)} icon={BarChart3} />
        {data.summary.hasReliableCost && data.summary.totalValue !== null ? (
          <StatCard title="Inventory Value" value={formatCurrency(data.summary.totalValue)} icon={DollarSign} />
        ) : (
          <StatCard title="Inventory Value" value="N/A" icon={DollarSign} description="Cost data unavailable" />
        )}
        <StatCard title="Low / Out of Stock" value={`${data.summary.lowStockProducts} / ${data.summary.outOfStockProducts}`} icon={AlertTriangle} />
      </div>

      {data.products.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium text-right">Current</th>
                    <th className="pb-2 font-medium text-right">Minimum</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2">
                        <p className="font-medium">{p.name}</p>
                        {p.sku && <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>}
                      </td>
                      <td className="py-2 text-muted-foreground">{p.category}</td>
                      <td className="py-2 text-right">{formatNumber(p.currentStock)}</td>
                      <td className="py-2 text-right">{formatNumber(p.minimumStock)}</td>
                      <td className="py-2 text-right">
                        <Badge variant={p.status === 'out_of_stock' ? 'destructive' : p.status === 'low_stock' ? 'secondary' : 'default'} className="text-xs">
                          {p.status === 'out_of_stock' ? 'Out of Stock' : p.status === 'low_stock' ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <EmptyState icon={Package} message="No inventory data available" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Customer Credit Tab ─────────────────────────────────

function CreditTab() {
  const { data, isLoading, error } = useCustomerCreditReport();

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-1">Failed to load credit report</p>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-7 w-32" /></CardContent>
            </Card>
          ))}
        </div>
        <Card><CardContent className="p-4"><TableSkeleton rows={5} /></CardContent></Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Outstanding Credit" value={formatCurrency(data.summary.totalOutstanding)} icon={CreditCard} />
        <StatCard title="Customers with Credit" value={String(data.summary.customerCount)} icon={Users} />
        <StatCard title="Approaching Limit" value={String(data.summary.approachingLimit)} icon={AlertTriangle} />
        <StatCard title="Exceeded Limit" value={String(data.summary.exceededLimit)} icon={TrendingDown} />
      </div>

      {data.customers.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Customer Credit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Phone</th>
                    <th className="pb-2 font-medium text-right">Credit Limit</th>
                    <th className="pb-2 font-medium text-right">Outstanding</th>
                    <th className="pb-2 font-medium text-right">Available</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.customers.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{c.name}</td>
                      <td className="py-2 text-muted-foreground">{c.phone || '-'}</td>
                      <td className="py-2 text-right">{c.creditLimit ? formatCurrency(c.creditLimit) : 'No limit'}</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(c.outstanding)}</td>
                      <td className="py-2 text-right">{c.availableCredit !== null ? formatCurrency(c.availableCredit) : 'Unlimited'}</td>
                      <td className="py-2 text-right">
                        <Badge variant={c.status === 'exceeded_limit' ? 'destructive' : c.status === 'approaching_limit' ? 'secondary' : 'default'} className="text-xs">
                          {c.status === 'exceeded_limit' ? 'Exceeded' : c.status === 'approaching_limit' ? 'Near Limit' : 'Healthy'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <EmptyState icon={CreditCard} message="No outstanding customer credit" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Expenses Tab ────────────────────────────────────────

function ExpensesTab({ filters }: { filters: ReportFilters }) {
  const { data, isLoading, error } = useExpenseReport(filters);
  const { data: profitability } = useProfitability(filters);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-1">Failed to load expenses report</p>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-7 w-32" /></CardContent>
            </Card>
          ))}
        </div>
        <Card><CardContent className="p-4"><ChartSkeleton /></CardContent></Card>
      </div>
    );
  }

  if (!data) return null;

  if (!data.available) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <EmptyState icon={Receipt} message="Expense tracking is not available yet. Create expense categories to enable expense reporting." />
          </CardContent>
        </Card>
        {profitability && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Profitability Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard title="Revenue" value={formatCurrency(profitability.revenue)} icon={DollarSign} />
                <StatCard title="Expenses" value={formatCurrency(profitability.expenses)} icon={Receipt} />
                <StatCard title="Estimated Profit" value={formatCurrency(profitability.estimatedProfit)} icon={TrendingUp} />
              </div>
              {!profitability.hasExpenseData && (
                <p className="text-xs text-muted-foreground mt-3">Expenses module not yet populated. Profit estimate is based on revenue only.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Expenses" value={formatCurrency(data.summary.totalExpenses)} icon={Receipt} />
        <StatCard title="Expense Count" value={String(data.summary.expenseCount)} icon={BarChart3} />
        {profitability && (
          <>
            <StatCard title="Revenue" value={formatCurrency(profitability.revenue)} icon={DollarSign} />
            <StatCard title="Estimated Profit" value={formatCurrency(profitability.estimatedProfit)} icon={TrendingUp} />
          </>
        )}
      </div>

      {data.byDate.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Expenses Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={data.byDate}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expenses" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {data.byCategory.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.byCategory.map((c) => {
                const pct = data.summary.totalExpenses > 0
                  ? Math.round((c.totalAmount / data.summary.totalExpenses) * 100)
                  : 0;
                return (
                  <div key={c.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.count} entries</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(c.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">{pct}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <EmptyState icon={Receipt} message="No expenses recorded for this period" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Main Reports Page ───────────────────────────────────

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({ range: '30d' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Business analytics and insights</p>
        </div>
        <ReportFiltersUI filters={filters} setFilters={setFilters} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="credit">Customer Credit</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab filters={filters} />
        </TabsContent>

        <TabsContent value="sales">
          <SalesTab filters={filters} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>

        <TabsContent value="credit">
          <CreditTab />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTab filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
