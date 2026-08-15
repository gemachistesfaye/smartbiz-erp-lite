import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from '../sales.service';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  sale: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    aggregate: jest.fn(),
  },
  saleItem: {
    create: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
  },
  inventory: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  inventoryTransaction: {
    create: jest.fn(),
  },
  customer: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  payment: {
    create: jest.fn(),
    aggregate: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSale', () => {
    describe('dueDate validation', () => {
      it('should require dueDate for CREDIT payments', async () => {
        const dto = {
          paymentMethod: 'CREDIT' as const,
          customerId: 'cust-1',
          items: [{ productId: 'prod-1', quantity: 2 }],
        };

        await expect(
          service.createSale('biz-1', 'user-1', dto),
        ).rejects.toThrow('Due date is required for credit sales');
      });

      it('should reject past dueDate', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        const dto = {
          paymentMethod: 'CREDIT' as const,
          customerId: 'cust-1',
          dueDate: pastDate.toISOString().split('T')[0],
          items: [{ productId: 'prod-1', quantity: 2 }],
        };

        await expect(
          service.createSale('biz-1', 'user-1', dto),
        ).rejects.toThrow('Due date cannot be in the past');
      });

      it('should accept valid future dueDate for CREDIT sales', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const dueDateStr = futureDate.toISOString().split('T')[0];

        mockPrisma.sale.count.mockResolvedValue(0);

        const mockTx = {
          product: {
            findMany: jest.fn().mockResolvedValue([
              {
                id: 'prod-1',
                businessId: 'biz-1',
                name: 'Test Product',
                sellingPrice: 100,
                inventory: { quantity: 100, averageCost: 50 },
              },
            ]),
          },
          inventory: {
            findMany: jest.fn().mockResolvedValue([
              { productId: 'prod-1', quantity: 100, averageCost: 50 },
            ]),
            update: jest.fn().mockResolvedValue({}),
          },
          sale: {
            create: jest.fn().mockResolvedValue({
              id: 'sale-1',
              businessId: 'biz-1',
              customerId: 'cust-1',
              cashierId: 'user-1',
              saleNumber: 'SB-20260815-0001',
              totalAmount: 200,
              paymentMethod: 'CREDIT',
              status: 'COMPLETED',
              dueDate: futureDate,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
            aggregate: jest.fn().mockResolvedValue({ _sum: { totalAmount: 0 } }),
          },
          saleItem: {
            create: jest.fn().mockResolvedValue({}),
          },
          inventoryTransaction: {
            create: jest.fn().mockResolvedValue({}),
          },
          customer: {
            findFirst: jest.fn().mockResolvedValue({
              id: 'cust-1',
              status: 'ACTIVE',
              creditBalance: 0,
              creditLimit: 1000,
            }),
            update: jest.fn().mockResolvedValue({}),
          },
          payment: {
            create: jest.fn().mockResolvedValue({}),
            aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 0 } }),
          },
        };

        mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

        mockPrisma.sale.findFirst.mockResolvedValue({
          id: 'sale-1',
          businessId: 'biz-1',
          customerId: 'cust-1',
          cashierId: 'user-1',
          saleNumber: 'SB-20260815-0001',
          totalAmount: 200,
          paymentMethod: 'CREDIT',
          status: 'COMPLETED',
          dueDate: futureDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          customer: { id: 'cust-1', firstName: 'John', lastName: 'Doe' },
          cashier: { id: 'user-1', firstName: 'Test', lastName: 'User' },
          items: [],
          payments: [],
        });

        const dto = {
          paymentMethod: 'CREDIT' as const,
          customerId: 'cust-1',
          dueDate: dueDateStr,
          items: [{ productId: 'prod-1', quantity: 2 }],
        };

        const result = await service.createSale('biz-1', 'user-1', dto);
        expect(result.dueDate).toEqual(futureDate);
      });

      it('should not require dueDate for CASH payments', async () => {
        mockPrisma.sale.count.mockResolvedValue(0);

        const mockTx = {
          product: {
            findMany: jest.fn().mockResolvedValue([
              {
                id: 'prod-1',
                businessId: 'biz-1',
                name: 'Test Product',
                sellingPrice: 100,
                inventory: { quantity: 100, averageCost: 50 },
              },
            ]),
          },
          inventory: {
            findMany: jest.fn().mockResolvedValue([
              { productId: 'prod-1', quantity: 100, averageCost: 50 },
            ]),
            update: jest.fn().mockResolvedValue({}),
          },
          sale: {
            create: jest.fn().mockResolvedValue({
              id: 'sale-1',
              businessId: 'biz-1',
              customerId: null,
              cashierId: 'user-1',
              saleNumber: 'SB-20260815-0001',
              totalAmount: 200,
              paymentMethod: 'CASH',
              status: 'COMPLETED',
              dueDate: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          },
          saleItem: {
            create: jest.fn().mockResolvedValue({}),
          },
          inventoryTransaction: {
            create: jest.fn().mockResolvedValue({}),
          },
          payment: {
            create: jest.fn().mockResolvedValue({}),
          },
        };

        mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

        mockPrisma.sale.findFirst.mockResolvedValue({
          id: 'sale-1',
          businessId: 'biz-1',
          customerId: null,
          cashierId: 'user-1',
          saleNumber: 'SB-20260815-0001',
          totalAmount: 200,
          paymentMethod: 'CASH',
          status: 'COMPLETED',
          dueDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          customer: null,
          cashier: { id: 'user-1', firstName: 'Test', lastName: 'User' },
          items: [],
          payments: [],
        });

        const dto = {
          paymentMethod: 'CASH' as const,
          items: [{ productId: 'prod-1', quantity: 2 }],
        };

        const result = await service.createSale('biz-1', 'user-1', dto);
        expect(result.dueDate).toBeNull();
      });
    });
  });
});
