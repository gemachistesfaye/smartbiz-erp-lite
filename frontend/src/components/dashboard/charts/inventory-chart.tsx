import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Electronics', value: 4000 },
  { name: 'Groceries', value: 3000 },
  { name: 'Clothing', value: 2000 },
  { name: 'Stationery', value: 1500 },
  { name: 'Other', value: 500 },
];

const COLORS = ['#0D8ABC', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

export function InventoryDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
