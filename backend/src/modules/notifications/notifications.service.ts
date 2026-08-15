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
    const customers = await this.prisma.customer.findMany({
      where: {
        businessId,
        deletedAt: null,
        creditBalance: { gt: 0 },
      },
      orderBy: { creditBalance: 'desc' },
    });

    const createdNotifications = [];

    for (const customer of customers) {
      // Check if a CREDIT_PAYMENT notification already exists in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          businessId,
          type: 'CREDIT_PAYMENT',
          title: `Payment Reminder: ${customer.firstName} ${customer.lastName}`,
          createdAt: { gte: sevenDaysAgo },
        },
      });

      if (existingNotification) {
        continue;
      }

      // Find the latest credit sale for this customer
      const latestSale = await this.prisma.sale.findFirst({
        where: {
          customerId: customer.id,
          businessId,
          paymentMethod: 'CREDIT',
          status: 'COMPLETED',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!latestSale) {
        continue;
      }

      const notification = await this.prisma.notification.create({
        data: {
          businessId,
          type: 'CREDIT_PAYMENT',
          title: `Payment Reminder: ${customer.firstName} ${customer.lastName}`,
          message: `Customer ${customer.firstName} ${customer.lastName} has an outstanding balance of ${customer.creditBalance} ETB`,
        },
      });

      createdNotifications.push(notification);
    }

    return {
      checked: customers.length,
      created: createdNotifications.length,
      notifications: createdNotifications,
    };
  }
}
