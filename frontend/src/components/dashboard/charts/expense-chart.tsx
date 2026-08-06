import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Rent', value: 15000 },
  { name: 'Utilities', value: 3500 },
  { name: 'Salaries', value: 25000 },
  { name: 'Supplies', value: 2000 },
  { name: 'Marketing', value: 4500 },
];

const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#0D8ABC'];

export function ExpenseBreakdownChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
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
