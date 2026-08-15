import { describe, it, expect } from 'vitest';
import type { Sale } from '../models';

describe('Sale model - dueDate', () => {
  it('should allow dueDate field on CREDIT sale', () => {
    const sale: Sale = {
      id: 'sale-1',
      saleNumber: 'SALE-001',
      businessId: 'biz-1',
      cashierId: 'user-1',
      paymentMethod: 'CREDIT',
      subtotal: 500,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 500,
      status: 'COMPLETED',
      dueDate: '2026-09-15',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(sale.dueDate).toBe('2026-09-15');
  });

  it('should allow undefined dueDate on CASH sale', () => {
    const sale: Sale = {
      id: 'sale-2',
      saleNumber: 'SALE-002',
      businessId: 'biz-1',
      cashierId: 'user-1',
      paymentMethod: 'CASH',
      subtotal: 100,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 100,
      status: 'COMPLETED',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(sale.dueDate).toBeUndefined();
  });

  it('should accept ISO date string for dueDate', () => {
    const sale: Sale = {
      id: 'sale-3',
      saleNumber: 'SALE-003',
      businessId: 'biz-1',
      cashierId: 'user-1',
      paymentMethod: 'CREDIT',
      subtotal: 200,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 200,
      status: 'COMPLETED',
      dueDate: '2026-12-31T00:00:00.000Z',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(sale.dueDate).toBe('2026-12-31T00:00:00.000Z');
  });
});
