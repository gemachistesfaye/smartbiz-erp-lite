import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesTrendChartProps {
  data?: Array<{ name: string; sales: number; expenses: number }>;
}

const fallbackData = [
  { name: 'Mon', sales: 0, expenses: 0 },
  { name: 'Tue', sales: 0, expenses: 0 },
  { name: 'Wed', sales: 0, expenses: 0 },
  { name: 'Thu', sales: 0, expenses: 0 },
  { name: 'Fri', sales: 0, expenses: 0 },
  { name: 'Sat', sales: 0, expenses: 0 },
  { name: 'Sun', sales: 0, expenses: 0 },
];

export function SalesTrendChart({ data = fallbackData }: SalesTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(222.2, 47.4%, 11.2%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(222.2, 47.4%, 11.2%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0, 84.2%, 60.2%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(0, 84.2%, 60.2%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="hsl(222.2, 47.4%, 11.2%)"
          strokeWidth={2}
          fill="url(#salesGradient)"
          name="Sales"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="hsl(0, 84.2%, 60.2%)"
          strokeWidth={2}
          fill="url(#expensesGradient)"
          name="Expenses"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
