function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => escapeCSV(row[h])).join(','),
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportSalesToCSV(
  sales: Array<{
    saleNumber: string;
    createdAt: string;
    customer?: string;
    paymentMethod: string;
    subtotal: number;
    discountAmount: number;
    totalAmount: number;
    status: string;
    items?: Array<{ productName: string; quantity: number; unitPrice: number; totalPrice: number }>;
  }>,
): void {
  const data = sales.map((s) => ({
    'Sale Number': s.saleNumber,
    'Date': new Date(s.createdAt).toLocaleDateString(),
    'Customer': s.customer || 'Walk-in',
    'Payment Method': s.paymentMethod,
    'Subtotal': s.subtotal,
    'Discount': s.discountAmount,
    'Total': s.totalAmount,
    'Status': s.status,
    'Items': s.items?.length || 0,
  }));

  downloadCSV(data, `sales-export-${new Date().toISOString().slice(0, 10)}`);
}

export function exportInventoryToCSV(
  products: Array<{
    name: string;
    sku?: string;
    category?: string;
    currentStock: number;
    minimumStock: number;
    unitCost: number;
    inventoryValue: number;
    status: string;
  }>,
): void {
  const data = products.map((p) => ({
    'Product Name': p.name,
    'SKU': p.sku || '',
    'Category': p.category || 'Uncategorized',
    'Current Stock': p.currentStock,
    'Minimum Stock': p.minimumStock,
    'Unit Cost': p.unitCost,
    'Inventory Value': p.inventoryValue,
    'Status': p.status,
  }));

  downloadCSV(data, `inventory-export-${new Date().toISOString().slice(0, 10)}`);
}

export function exportCustomerCreditToCSV(
  customers: Array<{
    name: string;
    phone?: string;
    creditLimit: number | null;
    outstanding: number;
    availableCredit: number | null;
    status: string;
  }>,
): void {
  const data = customers.map((c) => ({
    'Customer Name': c.name,
    'Phone': c.phone || '',
    'Credit Limit': c.creditLimit ?? 'No limit',
    'Outstanding Balance': c.outstanding,
    'Available Credit': c.availableCredit ?? 'Unlimited',
    'Status': c.status,
  }));

  downloadCSV(data, `customer-credit-export-${new Date().toISOString().slice(0, 10)}`);
}

export function exportExpensesToCSV(
  expenses: Array<{
    description: string;
    amount: number;
    date: string;
    category?: string;
    paymentMethod: string;
  }>,
): void {
  const data = expenses.map((e) => ({
    'Description': e.description,
    'Amount': e.amount,
    'Date': new Date(e.date).toLocaleDateString(),
    'Category': e.category || 'Uncategorized',
    'Payment Method': e.paymentMethod,
  }));

  downloadCSV(data, `expenses-export-${new Date().toISOString().slice(0, 10)}`);
}
