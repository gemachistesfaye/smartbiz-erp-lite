import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  action: string;
  target: string;
  time: string;
  type: 'sale' | 'product' | 'customer' | 'stock' | 'expense';
}

const typeColors: Record<Activity['type'], string> = {
  sale: 'bg-emerald-500',
  product: 'bg-blue-500',
  customer: 'bg-purple-500',
  stock: 'bg-amber-500',
  expense: 'bg-red-500',
};

interface ActivityCardProps {
  activities: Activity[];
  className?: string;
}

export function ActivityCard({ activities, className }: ActivityCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', typeColors[activity.type])} />
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{activity.action}</span>{' '}
              <span className="text-muted-foreground">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
