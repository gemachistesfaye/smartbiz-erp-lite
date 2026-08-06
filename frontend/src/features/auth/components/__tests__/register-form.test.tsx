import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { RegisterForm } from '@/features/auth/components/register-form';

const createTestRouter = (component: React.ReactNode) => {
  const rootRoute = createRootRoute({
    component: () => component,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  });

  const routeTree = rootRoute.addChildren([indexRoute]);

  return createRouter({ routeTree });
};

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const router = createTestRouter(component);

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<RegisterForm />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/business name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    renderWithProviders(<RegisterForm />);

    fireEvent.input(screen.getByLabelText(/business name/i), {
      target: { value: 'Test Business' },
    });
    fireEvent.input(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.input(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderWithProviders(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByText(/show/i));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByText(/hide/i));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
