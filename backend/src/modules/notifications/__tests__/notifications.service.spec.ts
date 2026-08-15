import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  notification: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  sale: {
    findMany: jest.fn(),
  },
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkOverdueReminders', () => {
    it('should create notifications for overdue credit sales', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      mockPrisma.sale.findMany.mockResolvedValue([
        {
          id: 'sale-1',
          customerId: 'cust-1',
          totalAmount: 500,
          dueDate: pastDate,
          customer: {
            id: 'cust-1',
            firstName: 'John',
            lastName: 'Doe',
            creditBalance: 500,
          },
        },
      ]);
      mockPrisma.notification.findFirst.mockResolvedValue(null);
      mockPrisma.notification.create.mockResolvedValue({
        id: 'notif-1',
        businessId: 'biz-1',
        type: 'CREDIT_PAYMENT',
        title: 'Payment Reminder: John Doe',
        message: 'test',
        isRead: false,
        createdAt: new Date(),
      });

      const result = await service.checkOverdueReminders('biz-1');
      expect(result.created).toBe(1);
      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: 'biz-1',
            type: 'CREDIT_PAYMENT',
          }),
        }),
      );
    });

    it('should skip duplicate notifications within 7 days', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      mockPrisma.sale.findMany.mockResolvedValue([
        {
          id: 'sale-1',
          customerId: 'cust-1',
          totalAmount: 500,
          dueDate: pastDate,
          customer: {
            id: 'cust-1',
            firstName: 'John',
            lastName: 'Doe',
            creditBalance: 500,
          },
        },
      ]);
      mockPrisma.notification.findFirst.mockResolvedValue({
        id: 'existing',
        type: 'CREDIT_PAYMENT',
        title: 'Payment Reminder: John Doe',
      });

      const result = await service.checkOverdueReminders('biz-1');
      expect(result.created).toBe(0);
      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });

    it('should skip customers with zero credit balance', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      mockPrisma.sale.findMany.mockResolvedValue([
        {
          id: 'sale-1',
          customerId: 'cust-1',
          totalAmount: 500,
          dueDate: pastDate,
          customer: {
            id: 'cust-1',
            firstName: 'John',
            lastName: 'Doe',
            creditBalance: 0,
          },
        },
      ]);

      const result = await service.checkOverdueReminders('biz-1');
      expect(result.created).toBe(0);
      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });

    it('should return empty when no overdue sales', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([]);

      const result = await service.checkOverdueReminders('biz-1');
      expect(result.checked).toBe(0);
      expect(result.created).toBe(0);
    });
  });
});
