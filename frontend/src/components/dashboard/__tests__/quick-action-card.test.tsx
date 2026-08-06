import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import { Plus } from 'lucide-react';

describe('QuickActionCard', () => {
  it('renders label text', () => {
    render(<QuickActionCard label="New Sale" icon={Plus} onClick={() => {}} />);

    expect(screen.getByText('New Sale')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<QuickActionCard label="New Sale" icon={Plus} onClick={() => {}} />);

    expect(screen.getByLabelText('New Sale')).toBeInTheDocument();
  });

  it('has role button', () => {
    render(<QuickActionCard label="New Sale" icon={Plus} onClick={() => {}} />);

    expect(screen.getByRole('button', { name: 'New Sale' })).toBeInTheDocument();
  });
});
