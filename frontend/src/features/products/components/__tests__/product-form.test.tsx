import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductForm } from '@/features/products/components/product-form';

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe('ProductForm', () => {
  it('renders basic information fields', () => {
    renderWithProviders(<ProductForm />);
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/barcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
  });

  it('renders pricing fields', () => {
    renderWithProviders(<ProductForm />);
    expect(screen.getByLabelText(/buying price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity purchased/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transportation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vat/i)).toBeInTheDocument();
  });

  it('shows validation error for empty product name', async () => {
    renderWithProviders(<ProductForm />);
    fireEvent.click(screen.getByRole('button', { name: /create product/i }));
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
    });
  });

  it('renders inventory fields', () => {
    renderWithProviders(<ProductForm />);
    expect(screen.getByLabelText(/reorder level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });
});
