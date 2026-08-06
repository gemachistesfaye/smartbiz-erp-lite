import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, expenses: 2400 },
  { name: 'Tue', sales: 3000, expenses: 1398 },
  { name: 'Wed', sales: 5000, expenses: 3800 },
  { name: 'Thu', sales: 2780, expenses: 3908 },
  { name: 'Fri', sales: 1890, expenses: 4800 },
  { name: 'Sat', sales: 6390, expenses: 3800 },
  { name: 'Sun', sales: 3490, expenses: 4300 },
];

export function SalesTrendChart() {
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
