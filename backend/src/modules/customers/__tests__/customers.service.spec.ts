import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '../customers.service';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  customer: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  sale: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
  },
  payment: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue({
        id: 'cust-1',
        businessId: 'biz-1',
        firstName: 'Abebe',
        lastName: 'Kebede',
        phone: '+251911234567',
        status: 'ACTIVE',
      });

      const result = await service.create('biz-1', {
        firstName: 'Abebe',
        lastName: 'Kebede',
        phone: '+251911234567',
      });

      expect(mockPrisma.customer.create).toHaveBeenCalled();
      expect(result.firstName).toBe('Abebe');
    });

    it('should reject duplicate phone', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create('biz-1', {
          firstName: 'Test',
          phone: '+251911234567',
        }),
      ).rejects.toThrow('already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      mockPrisma.customer.findMany.mockResolvedValue([]);
      mockPrisma.customer.count.mockResolvedValue(0);

      const result = await service.findAll('biz-1', { page: 1, limit: 20 });

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
      expect(result.data).toEqual([]);
    });

    it('should filter by status', async () => {
      mockPrisma.customer.findMany.mockResolvedValue([]);
      mockPrisma.customer.count.mockResolvedValue(0);

      await service.findAll('biz-1', { status: 'ACTIVE' });

      expect(mockPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'ACTIVE' }),
        }),
      );
    });

    it('should search by name', async () => {
      mockPrisma.customer.findMany.mockResolvedValue([]);
      mockPrisma.customer.count.mockResolvedValue(0);

      await service.findAll('biz-1', { search: 'Abebe' });

      expect(mockPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ firstName: expect.objectContaining({ contains: 'Abebe' }) }),
            ]),
          }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a customer', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        firstName: 'Abebe',
      });

      const result = await service.findById('cust-1', 'biz-1');
      expect(result.id).toBe('cust-1');
    });

    it('should throw if not found', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(service.findById('missing', 'biz-1')).rejects.toThrow('not found');
    });
  });

  describe('recordPayment', () => {
    it('should record payment and update balance', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        status: 'ACTIVE',
        creditBalance: 5000,
      });
      mockPrisma.sale.aggregate.mockResolvedValue({ _sum: { totalAmount: 10000 } });
      mockPrisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 5000 } });

      const mockTx = {
        payment: { create: jest.fn().mockResolvedValue({ id: 'pay-1', amount: 2000 }) },
        customer: { update: jest.fn().mockResolvedValue({}) },
      };
      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

      const result = await service.recordPayment('cust-1', 'biz-1', 'user-1', {
        amount: 2000,
        method: 'CASH',
      });

      expect(result.amount).toBe(2000);
      expect(mockTx.customer.update).toHaveBeenCalledWith({
        where: { id: 'cust-1' },
        data: { creditBalance: 3000 },
      });
    });

    it('should reject payment exceeding balance', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        status: 'ACTIVE',
      });
      mockPrisma.sale.aggregate.mockResolvedValue({ _sum: { totalAmount: 5000 } });
      mockPrisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 4000 } });

      await expect(
        service.recordPayment('cust-1', 'biz-1', 'user-1', {
          amount: 2000,
          method: 'CASH',
        }),
      ).rejects.toThrow('exceeds outstanding balance');
    });

    it('should reject payment for inactive customer', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        status: 'INACTIVE',
      });

      await expect(
        service.recordPayment('cust-1', 'biz-1', 'user-1', {
          amount: 1000,
          method: 'CASH',
        }),
      ).rejects.toThrow('inactive or blocked');
    });
  });

  describe('canUseCredit', () => {
    it('should return credit availability', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        creditLimit: 10000,
      });
      mockPrisma.sale.aggregate.mockResolvedValue({ _sum: { totalAmount: 7000 } });
      mockPrisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 2000 } });

      const result = await service.canUseCredit('cust-1', 'biz-1', 3000);

      expect(result.allowed).toBe(true);
      expect(result.currentBalance).toBe(5000);
      expect(result.creditLimit).toBe(10000);
      expect(result.availableCredit).toBe(5000);
      expect(result.requestedAmount).toBe(3000);
    });

    it('should reject when amount exceeds available credit', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        creditLimit: 10000,
      });
      mockPrisma.sale.aggregate.mockResolvedValue({ _sum: { totalAmount: 8000 } });
      mockPrisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 1000 } });

      const result = await service.canUseCredit('cust-1', 'biz-1', 5000);

      expect(result.allowed).toBe(false);
      expect(result.availableCredit).toBe(3000);
    });

    it(' should allow when no credit limit set', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        creditLimit: null,
      });
      mockPrisma.sale.aggregate.mockResolvedValue({ _sum: { totalAmount: 50000 } });
      mockPrisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 10000 } });

      const result = await service.canUseCredit('cust-1', 'biz-1', 5000);

      expect(result.allowed).toBe(true);
      expect(result.availableCredit).toBeNull();
    });
  });
});
