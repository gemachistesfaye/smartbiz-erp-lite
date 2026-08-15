import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    businessId: string,
    userId: string,
    query: { page?: number; limit?: number },
  ) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = {
      businessId,
      userId,
    };

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { ...where, isRead: false } }),
    ]);

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async markAsRead(id: string, businessId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, businessId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(businessId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { businessId, userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(businessId: string, userId: string) {
    const count = await this.prisma.notification.count({
      where: { businessId, userId, isRead: false },
    });

    return { unreadCount: count };
  }

  async checkOverdueReminders(businessId: string) {
    const now = new Date();

    const overdueSales = await this.prisma.sale.findMany({
      where: {
        businessId,
        paymentMethod: 'CREDIT',
        status: 'COMPLETED',
        dueDate: { lt: now },
        customerId: { not: null },
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            creditBalance: true,
          },
        },
      },
    });

    const createdNotifications = [];
    const processedCustomerIds = new Set<string>();

    for (const sale of overdueSales) {
      if (!sale.customer || Number(sale.customer.creditBalance) <= 0) continue;
      if (processedCustomerIds.has(sale.customerId!)) continue;
      processedCustomerIds.add(sale.customerId!);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          businessId,
          type: 'CREDIT_PAYMENT',
          title: `Payment Reminder: ${sale.customer.firstName} ${sale.customer.lastName}`,
          createdAt: { gte: sevenDaysAgo },
        },
      });

      if (existingNotification) continue;

      const daysOverdue = Math.floor((now.getTime() - new Date(sale.dueDate!).getTime()) / (1000 * 60 * 60 * 24));

      const notification = await this.prisma.notification.create({
        data: {
          businessId,
          type: 'CREDIT_PAYMENT',
          title: `Payment Reminder: ${sale.customer.firstName} ${sale.customer.lastName}`,
          message: `Customer ${sale.customer.firstName} ${sale.customer.lastName} has an outstanding balance of ${sale.customer.creditBalance} ETB, overdue by ${daysOverdue} days (due: ${new Date(sale.dueDate!).toLocaleDateString()})`,
        },
      });

      createdNotifications.push(notification);
    }

    return {
      checked: processedCustomerIds.size,
      created: createdNotifications.length,
      notifications: createdNotifications,
    };
  }
}
