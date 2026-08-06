import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityCard } from '@/components/dashboard/activity-card';

const mockActivities = [
  {
    id: '1',
    action: 'New sale recorded',
    target: 'ETB 2,450',
    time: '10 minutes ago',
    type: 'sale' as const,
  },
  {
    id: '2',
    action: 'Product added',
    target: 'Wireless Mouse',
    time: '30 minutes ago',
    type: 'product' as const,
  },
];

describe('ActivityCard', () => {
  it('renders activity items', () => {
    render(<ActivityCard activities={mockActivities} />);

    expect(screen.getByText('New sale recorded')).toBeInTheDocument();
    expect(screen.getByText('ETB 2,450')).toBeInTheDocument();
    expect(screen.getByText('Product added')).toBeInTheDocument();
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
  });

  it('renders timestamps', () => {
    render(<ActivityCard activities={mockActivities} />);

    expect(screen.getByText('10 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('30 minutes ago')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<ActivityCard activities={[]} />);

    expect(screen.queryByText('New sale recorded')).not.toBeInTheDocument();
  });
});
