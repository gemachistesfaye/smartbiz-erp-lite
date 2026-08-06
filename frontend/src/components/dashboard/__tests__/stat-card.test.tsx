import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ShoppingCart } from 'lucide-react';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Today's Sales"
        value="ETB 12,450"
        icon={ShoppingCart}
      />,
    );

    expect(screen.getByText("Today's Sales")).toBeInTheDocument();
    expect(screen.getByText('ETB 12,450')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <StatCard
        title="Today's Sales"
        value="ETB 12,450"
        description="18 transactions"
        icon={ShoppingCart}
      />,
    );

    expect(screen.getByText('18 transactions')).toBeInTheDocument();
  });

  it('renders trend indicator when provided', () => {
    render(
      <StatCard
        title="Today's Sales"
        value="ETB 12,450"
        icon={ShoppingCart}
        trend={{ value: 12, isPositive: true }}
      />,
    );

    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders negative trend', () => {
    render(
      <StatCard
        title="Low Stock"
        value="18"
        icon={ShoppingCart}
        trend={{ value: 5, isPositive: false }}
      />,
    );

    expect(screen.getByText('5%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });
});
