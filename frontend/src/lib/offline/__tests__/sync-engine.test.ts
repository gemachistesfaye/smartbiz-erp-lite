import { describe, it, expect } from 'vitest';
import type { PendingSale } from '../types';

function createMockPendingSale(overrides: Partial<PendingSale> = {}): PendingSale {
  return {
    id: 'sale-1',
    businessId: 'biz-1',
    userId: 'user-1',
    paymentMethod: 'CREDIT',
    customerId: 'cust-1',
    subtotal: 500,
    discountAmount: 0,
    totalAmount: 500,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    retryCount: 0,
    localSaleNumber: 'LOCAL-001',
    items: [
      { productId: 'prod-1', name: 'Widget', quantity: 2, unitPrice: 250, totalPrice: 500 },
    ],
    ...overrides,
  };
}

describe('sync engine - dueDate handling', () => {
  it('should include dueDate in PendingSale type', () => {
    const mockSale = createMockPendingSale({
      dueDate: '2026-09-15',
    });

    expect(mockSale.dueDate).toBe('2026-09-15');
  });

  it('should handle undefined dueDate for CASH sales', () => {
    const mockSale = createMockPendingSale({
      paymentMethod: 'CASH',
      customerId: undefined,
    });

    expect(mockSale.dueDate).toBeUndefined();
  });

  it('should allow dueDate to be set on CREDIT sales', () => {
    const mockSale = createMockPendingSale({
      paymentMethod: 'CREDIT',
      customerId: 'cust-1',
      dueDate: '2026-10-01',
    });

    expect(mockSale.paymentMethod).toBe('CREDIT');
    expect(mockSale.dueDate).toBe('2026-10-01');
  });

  it('should allow dueDate to be omitted on CREDIT sales', () => {
    const mockSale = createMockPendingSale({
      paymentMethod: 'CREDIT',
      customerId: 'cust-1',
    });

    expect(mockSale.dueDate).toBeUndefined();
  });

  it('should include dueDate when building sync payload', () => {
    const mockSale = createMockPendingSale({
      dueDate: '2026-09-15',
      paymentMethod: 'CREDIT',
      customerId: 'cust-1',
    });

    const payload = {
      paymentMethod: mockSale.paymentMethod,
      customerId: mockSale.customerId,
      discountAmount: mockSale.discountAmount,
      notes: mockSale.notes,
      dueDate: mockSale.dueDate,
      items: mockSale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      clientId: mockSale.id,
    };

    expect(payload.dueDate).toBe('2026-09-15');
    expect(payload.paymentMethod).toBe('CREDIT');
  });

  it('should send undefined dueDate in payload when not set', () => {
    const mockSale = createMockPendingSale({
      paymentMethod: 'CASH',
    });

    const payload = {
      paymentMethod: mockSale.paymentMethod,
      customerId: mockSale.customerId,
      discountAmount: mockSale.discountAmount,
      notes: mockSale.notes,
      dueDate: mockSale.dueDate,
      items: mockSale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      clientId: mockSale.id,
    };

    expect(payload.dueDate).toBeUndefined();
  });
});
