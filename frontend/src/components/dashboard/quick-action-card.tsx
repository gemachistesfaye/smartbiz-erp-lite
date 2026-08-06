import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

export function QuickActionCard({ label, icon: Icon, onClick, className }: QuickActionProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.98]',
        className,
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={label}
    >
      <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-medium text-center">{label}</span>
      </CardContent>
    </Card>
  );
}
