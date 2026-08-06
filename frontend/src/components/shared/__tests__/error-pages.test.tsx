import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

import { NotFoundPage } from '@/components/shared/not-found-page';
import { UnauthorizedPage } from '@/components/shared/unauthorized-page';
import { ServerErrorPage } from '@/components/shared/server-error-page';

describe('NotFoundPage', () => {
  it('renders 404 heading', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders back to dashboard link', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
});

describe('UnauthorizedPage', () => {
  it('renders 403 heading', () => {
    render(<UnauthorizedPage />);
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});

describe('ServerErrorPage', () => {
  it('renders 500 heading', () => {
    render(<ServerErrorPage />);
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Server Error')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<ServerErrorPage message="Database connection failed" />);
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
  });

  it('renders retry button when onRetry provided', () => {
    const onRetry = () => {};
    render(<ServerErrorPage onRetry={onRetry} />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
