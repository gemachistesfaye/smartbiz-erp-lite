import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Product A', sold: 120 },
  { name: 'Product B', sold: 98 },
  { name: 'Product C', sold: 86 },
  { name: 'Product D', sold: 72 },
  { name: 'Product E', sold: 65 },
];

export function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="sold" fill="hsl(210, 40%, 96.1%)" radius={[0, 4, 4, 0]} name="Units Sold" />
      </BarChart>
    </ResponsiveContainer>
  );
}
