import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(businessId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      overview,
      salesTrend,
      recentSales,
      topSellingProducts,
      inventorySummary,
      customerCreditSummary,
      activityFeed,
    ] = await Promise.all([
      this.getOverview(businessId, todayStart, todayEnd, monthStart, monthEnd, lastMonthStart),
      this.getSalesTrend(businessId),
      this.getRecentSales(businessId),
      this.getTopSellingProducts(businessId),
      this.getInventorySummary(businessId),
      this.getCustomerCreditSummary(businessId),
      this.getActivityFeed(businessId),
    ]);

    return {
      overview,
      salesTrend,
      recentSales,
      topSellingProducts,
      inventorySummary,
      customerCreditSummary,
      activityFeed,
    };
  }

  private async getOverview(
    businessId: string,
    todayStart: Date,
    todayEnd: Date,
    monthStart: Date,
    monthEnd: Date,
    lastMonthStart: Date,
  ) {
    const [
      todaySalesResult,
      todaySaleCount,
      monthlyRevenueResult,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      outstandingCredit,
      totalExpensesResult,
      lastMonthRevenueResult,
    ] = await Promise.all([
      this.prisma.sale.aggregate({
        where: {
          businessId,
          status: 'COMPLETED',
          createdAt: { gte: todayStart, lt: todayEnd },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.sale.count({
        where: {
          businessId,
          status: 'COMPLETED',
          createdAt: { gte: todayStart, lt: todayEnd },
        },
      }),
      this.prisma.sale.aggregate({
        where: {
          businessId,
          status: 'COMPLETED',
          createdAt: { gte: monthStart, lt: monthEnd },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.product.count({
        where: { businessId, isActive: true, deletedAt: null },
      }),
      this.prisma.inventory.findMany({
        where: {
          product: { businessId, deletedAt: null },
          quantity: { gt: 0 },
          minThreshold: { gt: 0 },
        },
        include: {
          product: { select: { reorderLevel: true } },
        },
      }),
      this.prisma.customer.count({
        where: { businessId, deletedAt: null },
      }),
      this.prisma.customer.aggregate({
        where: { businessId, deletedAt: null },
        _sum: { creditBalance: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          businessId,
          date: { gte: monthStart, lt: monthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.sale.aggregate({
        where: {
          businessId,
          status: 'COMPLETED',
          createdAt: { gte: lastMonthStart, lt: monthStart },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    const todaySales = Number(todaySalesResult._sum.totalAmount || 0);
    const monthlyRevenue = Number(monthlyRevenueResult._sum.totalAmount || 0);
    const lastMonthRevenue = Number(lastMonthRevenueResult._sum.totalAmount || 0);
    const totalExpenses = Number(totalExpensesResult._sum.amount || 0);

    const lowStockCount = lowStockProducts.filter(
      (inv) => inv.quantity <= inv.minThreshold,
    ).length;

    const outstanding = Number(outstandingCredit._sum.creditBalance || 0);
    const estimatedProfit = monthlyRevenue - totalExpenses;

    const revenueTrend =
      lastMonthRevenue > 0
        ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0;

    return {
      todaySales,
      todaySaleCount,
      monthlyRevenue,
      totalProducts,
      lowStockProducts: lowStockCount,
      totalCustomers,
      outstandingCredit: outstanding,
      totalExpenses,
      estimatedProfit,
      revenueTrend,
    };
  }

  private async getSalesTrend(businessId: string) {
    const now = new Date();
    const days = 7;
    const trend: Array<{ date: string; day: string; sales: number; expenses: number }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);

      const [salesResult, expensesResult] = await Promise.all([
        this.prisma.sale.aggregate({
          where: {
            businessId,
            status: 'COMPLETED',
            createdAt: { gte: dayStart, lt: dayEnd },
          },
          _sum: { totalAmount: true },
        }),
        this.prisma.expense.aggregate({
          where: {
            businessId,
            date: { gte: dayStart, lt: dayEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      trend.push({
        date: dayStart.toISOString().slice(0, 10),
        day: dayNames[dayStart.getDay()],
        sales: Number(salesResult._sum.totalAmount || 0),
        expenses: Number(expensesResult._sum.amount || 0),
      });
    }

    return trend;
  }

  private async getRecentSales(businessId: string) {
    const sales = await this.prisma.sale.findMany({
      where: { businessId },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    return sales.map((sale) => ({
      id: sale.id,
      customer: sale.customer
        ? `${sale.customer.firstName} ${sale.customer.lastName || ''}`.trim()
        : 'Walk-in Customer',
      amount: Number(sale.totalAmount),
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      createdAt: sale.createdAt.toISOString(),
    }));
  }

  private async getTopSellingProducts(businessId: string) {
    const results = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          businessId,
          status: 'COMPLETED',
        },
      },
      _sum: { quantity: true, totalPrice: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productIds = results.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, businessId },
      include: {
        category: { select: { name: true } },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    return results.map((result) => {
      const product = productMap.get(result.productId);
      return {
        id: result.productId,
        name: product?.name || 'Unknown Product',
        category: product?.category?.name || 'Uncategorized',
        quantitySold: result._sum.quantity || 0,
        revenue: Number(result._sum.totalPrice || 0),
      };
    });
  }

  private async getInventorySummary(businessId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: {
        product: { businessId, deletedAt: null },
      },
      include: {
        product: {
          select: {
            name: true,
            categoryId: true,
            category: { select: { name: true } },
          },
        },
      },
    });

    const categoryMap = new Map<
      string,
      { name: string; productCount: number; totalStock: number }
    >();

    for (const inv of inventories) {
      const catName = inv.product.category?.name || 'Uncategorized';
      const catId = inv.product.categoryId || 'uncategorized';

      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, { name: catName, productCount: 0, totalStock: 0 });
      }

      const cat = categoryMap.get(catId)!;
      cat.productCount += 1;
      cat.totalStock += inv.quantity;
    }

    return Array.from(categoryMap.values());
  }

  private async getCustomerCreditSummary(businessId: string) {
    const customers = await this.prisma.customer.findMany({
      where: {
        businessId,
        deletedAt: null,
        creditBalance: { gt: 0 },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        creditBalance: true,
        creditLimit: true,
      },
      orderBy: { creditBalance: 'desc' },
      take: 5,
    });

    const totalOutstanding = customers.reduce(
      (sum, c) => sum + Number(c.creditBalance),
      0,
    );

    return {
      totalOutstanding,
      customerCount: customers.length,
      topCustomers: customers.map((c) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName || ''}`.trim(),
        balance: Number(c.creditBalance),
        limit: c.creditLimit ? Number(c.creditLimit) : null,
      })),
    };
  }

  private async getActivityFeed(businessId: string) {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const [recentSales, recentInventory, recentPayments] = await Promise.all([
      this.prisma.sale.findMany({
        where: {
          businessId,
          createdAt: { gte: threeHoursAgo },
        },
        include: {
          customer: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.inventoryTransaction.findMany({
        where: {
          businessId,
          createdAt: { gte: threeHoursAgo },
        },
        include: {
          product: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.payment.findMany({
        where: {
          businessId,
          createdAt: { gte: threeHoursAgo },
        },
        include: {
          customer: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const activities: Array<{
      id: string;
      action: string;
      target: string;
      time: string;
      type: 'sale' | 'product' | 'customer' | 'stock' | 'expense';
      timestamp: Date;
    }> = [];

    for (const sale of recentSales) {
      const customerName = sale.customer
        ? `${sale.customer.firstName} ${sale.customer.lastName || ''}`.trim()
        : 'Walk-in';
      activities.push({
        id: `sale-${sale.id}`,
        action: sale.status === 'VOIDED' ? 'Sale voided' : 'Sale completed',
        target: `ETB ${Number(sale.totalAmount).toLocaleString()} - ${customerName}`,
        time: this.getTimeAgo(sale.createdAt),
        type: 'sale',
        timestamp: sale.createdAt,
      });
    }

    for (const tx of recentInventory) {
      const actionMap: Record<string, string> = {
        STOCK_IN: 'Stock received',
        STOCK_OUT: 'Stock sold',
        ADJUSTMENT: 'Stock adjusted',
        DAMAGE: 'Damage recorded',
        LOSS: 'Loss recorded',
      };
      activities.push({
        id: `inv-${tx.id}`,
        action: actionMap[tx.type] || 'Inventory updated',
        target: `${tx.product.name} (${tx.quantity > 0 ? '+' : ''}${tx.quantity})`,
        time: this.getTimeAgo(tx.createdAt),
        type: 'stock',
        timestamp: tx.createdAt,
      });
    }

    for (const payment of recentPayments) {
      if (payment.type === 'OUTGOING') {
        const customerName = payment.customer
          ? `${payment.customer.firstName} ${payment.customer.lastName || ''}`.trim()
          : '';
        activities.push({
          id: `pay-${payment.id}`,
          action: 'Refund processed',
          target: `ETB ${Number(payment.amount).toLocaleString()}${customerName ? ` - ${customerName}` : ''}`,
          time: this.getTimeAgo(payment.createdAt),
          type: 'expense',
          timestamp: payment.createdAt,
        });
      }
    }

    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return activities.slice(0, 10).map(({ timestamp: _, ...rest }) => rest);
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
