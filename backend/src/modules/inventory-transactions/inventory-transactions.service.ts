import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryTransactionQueryDto } from './dto/inventory-transaction.dto';

@Injectable()
export class InventoryTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(businessId: string, query: InventoryTransactionQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { businessId };

    if (query.type) {
      where.type = query.type;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.search) {
      where.OR = [
        { reason: { contains: query.search, mode: 'insensitive' } },
        { referenceType: { contains: query.search, mode: 'insensitive' } },
        { product: { name: { contains: query.search, mode: 'insensitive' } } },
        { product: { sku: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [transactions, total] = await Promise.all([
      this.prisma.inventoryTransaction.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unit: { select: { name: true, symbol: true } },
            },
          },
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.inventoryTransaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByProductId(productId: string, businessId: string, limit = 50) {
    return this.prisma.inventoryTransaction.findMany({
      where: { productId, businessId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getStats(businessId: string) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayCount, monthCount, totalByType] = await Promise.all([
      this.prisma.inventoryTransaction.count({
        where: { businessId, createdAt: { gte: startOfDay } },
      }),
      this.prisma.inventoryTransaction.count({
        where: { businessId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.inventoryTransaction.groupBy({
        by: ['type'],
        where: { businessId },
        _count: { id: true },
      }),
    ]);

    const byType: Record<string, number> = {};
    for (const item of totalByType) {
      byType[item.type] = item._count.id;
    }

    return {
      todayTransactions: todayCount,
      monthTransactions: monthCount,
      byType,
    };
  }
}
