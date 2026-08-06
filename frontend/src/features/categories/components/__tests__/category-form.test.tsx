import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { CategoryForm } from '@/features/categories/components/category-form';

const createTestRouter = (component: React.ReactNode) => {
  const rootRoute = createRootRoute({ component: () => component });
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' });
  return createRouter({ routeTree: rootRoute.addChildren([indexRoute]) });
};

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createTestRouter(component);
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

describe('CategoryForm', () => {
  it('renders form fields', () => {
    renderWithProviders(<CategoryForm />);
    expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    renderWithProviders(<CategoryForm />);
    fireEvent.click(screen.getByRole('button', { name: /create category/i }));
    await waitFor(() => {
      expect(screen.getByText(/category name is required/i)).toBeInTheDocument();
    });
  });

  it('renders with default values when editing', () => {
    renderWithProviders(
      <CategoryForm
        category={{
          id: '1',
          name: 'Electronics',
          description: 'Electronic devices',
          isActive: true,
          businessId: 'b1',
          createdAt: '',
          updatedAt: '',
        }}
      />,
    );
    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Electronic devices')).toBeInTheDocument();
  });
});
