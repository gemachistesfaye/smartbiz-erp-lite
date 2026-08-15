import { Test, TestingModule } from '@nestjs/testing';
import { BackupService } from '../backup.service';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  business: {
    findUnique: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  unit: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  supplier: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  customer: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  sale: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  saleItem: {
    findMany: jest.fn(),
  },
  payment: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  expense: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  expenseCategory: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  inventory: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  inventoryTransaction: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  stockReceiving: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  stockReceivingItem: {
    findMany: jest.fn(),
  },
  stockAdjustment: {
    findMany: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
  },
  businessSettings: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('BackupService', () => {
  let service: BackupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BackupService>(BackupService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dueDate handling', () => {
    it('should preserve dueDate in imported sales', async () => {
      const dueDate = new Date('2026-09-15');
      const backupData = {
        version: '1.0',
        data: {
          expenseCategories: [],
          categories: [],
          units: [],
          suppliers: [],
          customers: [],
          products: [],
          sales: [
            {
              saleNumber: 'SB-20260815-0001',
              businessId: 'biz-1',
              customerId: 'cust-1',
              cashierId: 'user-1',
              totalAmount: 500,
              subtotal: 500,
              paymentMethod: 'CREDIT',
              status: 'COMPLETED',
              dueDate: dueDate.toISOString(),
              items: [],
            },
          ],
          payments: [],
          expenses: [],
          inventory: [],
          inventoryTransactions: [],
          stockReceivings: [],
          stockAdjustments: [],
        },
      };

      const mockTx = {
        expenseCategory: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        category: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        unit: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        supplier: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        customer: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        product: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        user: { findFirst: jest.fn().mockResolvedValue({ id: 'user-1', firstName: 'Test' }) },
        sale: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            id: 'sale-1',
            businessId: 'biz-1',
            saleNumber: 'SB-20260815-0001',
            paymentMethod: 'CREDIT',
            totalAmount: 500,
            status: 'COMPLETED',
            dueDate,
          }),
        },
        payment: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        expense: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        inventory: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn(),
        },
        inventoryTransaction: { create: jest.fn() },
        stockReceiving: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        stockAdjustment: { create: jest.fn() },
      };

      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

      const result = await service.importBackup('biz-1', backupData as any);
      expect(result.summary.sales.created).toBe(1);
      expect(mockTx.sale.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dueDate: dueDate,
          }),
        }),
      );
    });

    it('should handle null dueDate for CASH sales', async () => {
      const backupData = {
        version: '1.0',
        data: {
          expenseCategories: [],
          categories: [],
          units: [],
          suppliers: [],
          customers: [],
          products: [],
          sales: [
            {
              saleNumber: 'SB-20260815-0002',
              businessId: 'biz-1',
              cashierId: 'user-1',
              totalAmount: 300,
              subtotal: 300,
              paymentMethod: 'CASH',
              status: 'COMPLETED',
              items: [],
            },
          ],
          payments: [],
          expenses: [],
          inventory: [],
          inventoryTransactions: [],
          stockReceivings: [],
          stockAdjustments: [],
        },
      };

      const mockTx = {
        expenseCategory: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        category: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        unit: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        supplier: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        customer: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        product: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        user: { findFirst: jest.fn().mockResolvedValue({ id: 'user-1', firstName: 'Test' }) },
        sale: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            id: 'sale-2',
            businessId: 'biz-1',
            saleNumber: 'SB-20260815-0002',
            paymentMethod: 'CASH',
            totalAmount: 300,
            status: 'COMPLETED',
            dueDate: null,
          }),
        },
        payment: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        expense: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        inventory: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn(),
        },
        inventoryTransaction: { create: jest.fn() },
        stockReceiving: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
        stockAdjustment: { create: jest.fn() },
      };

      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

      const result = await service.importBackup('biz-1', backupData as any);
      expect(result.summary.sales.created).toBe(1);
      expect(mockTx.sale.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dueDate: null,
          }),
        }),
      );
    });
  });
});
