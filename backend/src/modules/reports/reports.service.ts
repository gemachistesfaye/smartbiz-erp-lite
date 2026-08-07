import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportFilterDto } from './dto/report-filter.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private resolveDateRange(filters: ReportFilterDto) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    if (filters.range === 'custom' && filters.startDate && filters.endDate) {
      return {
        start: new Date(filters.startDate),
        end: new Date(new Date(filters.endDate).getTime() + 86400000),
      };
    }

    switch (filters.range) {
      case 'today':
        return { start: todayStart, end: todayEnd };
      case 'yesterday': {
        const d = new Date(todayStart.getTime() - 86400000);
        return { start: d, end: todayStart };
      }
      case '7d': {
        const d = new Date(todayStart.getTime() - 6 * 86400000);
        return { start: d, end: todayEnd };
      }
      case 'thisMonth':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: todayEnd,
        };
      case 'lastMonth': {
        const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const e = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: s, end: e };
      }
      case '30d':
      default: {
        const d = new Date(todayStart.getTime() - 29 * 86400000);
        return { start: d, end: todayEnd };
      }
    }
  }

  // ── Overview ──────────────────────────────────────────

  async getOverview(businessId: string, filters: ReportFilterDto) {
    const { start, end } = this.resolveDateRange(filters);
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

    const [
      periodSales,
      periodSaleCount,
      monthlyRevenue,
      lastMonthRevenue,
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalCustomers,
      outstandingCredit,
      monthlyExpenses,
    ] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { businessId, status: 'COMPLETED', createdAt: { gte: start, lt: end } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.sale.count({
        where: { businessId, status: 'COMPLETED', createdAt: { gte: start, lt: end } },
      }),
      this.prisma.sale.aggregate({
        where: { businessId, status: 'COMPLETED', createdAt: { gte: monthStart, lt: monthEnd } },
        _sum: { totalAmount: true },
      }),
      this.prisma.sale.aggregate({
        where: { businessId, status: 'COMPLETED', createdAt: { gte: lastMonthStart, lt: monthStart } },
        _sum: { totalAmount: true },
      }),
      this.prisma.product.count({ where: { businessId, isActive: true, deletedAt: null } }),
      this.prisma.inventory.findMany({
        where: { product: { businessId, deletedAt: null }, quantity: { gt: 0 }, minThreshold: { gt: 0 } },
        include: { product: { select: { reorderLevel: true } } },
      }),
      this.prisma.inventory.count({
        where: { product: { businessId, deletedAt: null }, quantity: 0 },
      }),
      this.prisma.customer.count({ where: { businessId, deletedAt: null } }),
      this.prisma.customer.aggregate({
        where: { businessId, deletedAt: null },
        _sum: { creditBalance: true },
      }),
      this.prisma.expense.aggregate({
        where: { businessId, date: { gte: monthStart, lt: monthEnd } },
        _sum: { amount: true },
      }),
    ]);

    const lowStock = lowStockCount.filter((i) => i.quantity <= i.minThreshold).length;
    const monthlyRev = Number(monthlyRevenue._sum.totalAmount || 0);
    const lastMonthRev = Number(lastMonthRevenue._sum.totalAmount || 0);
    const expenses = Number(monthlyExpenses._sum.amount || 0);

    return {
      periodRevenue: Number(periodSales._sum.totalAmount || 0),
      periodSaleCount,
      monthlyRevenue: monthlyRev,
      revenueTrend: lastMonthRev > 0 ? Math.round(((monthlyRev - lastMonthRev) / lastMonthRev) * 100) : 0,
      totalProducts,
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStockCount,
      totalCustomers,
      outstandingCredit: Number(outstandingCredit._sum.creditBalance || 0),
      totalExpenses: expenses,
      estimatedProfit: monthlyRev - expenses,
    };
  }

  // ── Sales Report ──────────────────────────────────────

  async getSalesReport(businessId: string, filters: ReportFilterDto) {
    const { start, end } = this.resolveDateRange(filters);

    const saleWhere: any = {
      businessId,
      status: 'COMPLETED',
      createdAt: { gte: start, lt: end },
    };
    if (filters.paymentMethod) saleWhere.paymentMethod = filters.paymentMethod;

    const [
      summary,
      salesByDay,
      paymentBreakdown,
      topProducts,
      categoryBreakdown,
    ] = await Promise.all([
      this.prisma.sale.aggregate({
        where: saleWhere,
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.getSalesTrendByRange(businessId, start, end, filters),
      this.prisma.sale.groupBy({
        by: ['paymentMethod'],
        where: saleWhere,
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.getTopProductsByRange(businessId, start, end, filters),
      this.getCategoryBreakdownByRange(businessId, start, end, filters),
    ]);

    const totalRevenue = Number(summary._sum.totalAmount || 0);
    const totalSales = summary._count;
    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    const cashResult = await this.prisma.sale.aggregate({
      where: { ...saleWhere, paymentMethod: 'CASH' },
      _sum: { totalAmount: true },
    });
    const creditResult = await this.prisma.sale.aggregate({
      where: { ...saleWhere, paymentMethod: 'CREDIT' },
      _sum: { totalAmount: true },
    });

    return {
      summary: {
        totalRevenue,
        totalSales,
        averageSale: Math.round(avgSale * 100) / 100,
        cashSales: Number(cashResult._sum.totalAmount || 0),
        creditSales: Number(creditResult._sum.totalAmount || 0),
      },
      salesTrend: salesByDay,
      paymentBreakdown: paymentBreakdown.map((p) => ({
        method: p.paymentMethod,
        totalRevenue: Number(p._sum.totalAmount || 0),
        count: p._count,
      })),
      topProducts,
      categoryBreakdown,
    };
  }

  private async getSalesTrendByRange(
    businessId: string,
    start: Date,
    end: Date,
    filters: ReportFilterDto,
  ) {
    const days = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const limit = Math.min(days, 90);
    const trend: Array<{ date: string; revenue: number; sales: number }> = [];

    const saleWhereBase: any = {
      businessId,
      status: 'COMPLETED',
    };
    if (filters.paymentMethod) saleWhereBase.paymentMethod = filters.paymentMethod;

    for (let i = 0; i < limit; i++) {
      const dayStart = new Date(start.getTime() + i * 86400000);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      if (dayStart >= end) break;

      const result = await this.prisma.sale.aggregate({
        where: { ...saleWhereBase, createdAt: { gte: dayStart, lt: dayEnd } },
        _sum: { totalAmount: true },
        _count: true,
      });

      trend.push({
        date: dayStart.toISOString().slice(0, 10),
        revenue: Number(result._sum.totalAmount || 0),
        sales: result._count,
      });
    }

    return trend;
  }

  private async getTopProductsByRange(
    businessId: string,
    start: Date,
    end: Date,
    filters: ReportFilterDto,
  ) {
    const saleItemWhere: any = {
      sale: { businessId, status: 'COMPLETED', createdAt: { gte: start, lt: end } },
    };
    if (filters.paymentMethod) saleItemWhere.sale.paymentMethod = filters.paymentMethod;
    if (filters.categoryId) {
      saleItemWhere.product = { categoryId: filters.categoryId };
    }

    const results = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: saleItemWhere,
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const productIds = results.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, businessId },
      include: { category: { select: { name: true } } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const totalQty = results.reduce((s, r) => s + (r._sum.quantity || 0), 0);

    return results.map((r) => {
      const product = productMap.get(r.productId);
      const qty = r._sum.quantity || 0;
      return {
        id: r.productId,
        name: product?.name || 'Unknown',
        category: product?.category?.name || 'Uncategorized',
        quantitySold: qty,
        revenue: Number(r._sum.totalPrice || 0),
        percentageOfSales: totalQty > 0 ? Math.round((qty / totalQty) * 10000) / 100 : 0,
      };
    });
  }

  private async getCategoryBreakdownByRange(
    businessId: string,
    start: Date,
    end: Date,
    filters: ReportFilterDto,
  ) {
    const saleItemWhere: any = {
      sale: { businessId, status: 'COMPLETED', createdAt: { gte: start, lt: end } },
    };
    if (filters.paymentMethod) saleItemWhere.sale.paymentMethod = filters.paymentMethod;

    const items = await this.prisma.saleItem.findMany({
      where: saleItemWhere,
      select: {
        quantity: true,
        totalPrice: true,
        product: {
          select: {
            categoryId: true,
            category: { select: { name: true } },
          },
        },
      },
    });

    const catMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    let totalQty = 0;

    for (const item of items) {
      const catId = item.product.categoryId || 'uncat';
      const catName = item.product.category?.name || 'Uncategorized';
      if (!catMap.has(catId)) catMap.set(catId, { name: catName, quantity: 0, revenue: 0 });
      const c = catMap.get(catId)!;
      c.quantity += item.quantity;
      c.revenue += Number(item.totalPrice);
      totalQty += item.quantity;
    }

    return Array.from(catMap.values())
      .map((c) => ({
        ...c,
        percentage: totalQty > 0 ? Math.round((c.quantity / totalQty) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  // ── Inventory Report ──────────────────────────────────

  async getInventoryReport(businessId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: { product: { businessId, deletedAt: null } },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            buyingPrice: true,
            sellingPrice: true,
            reorderLevel: true,
            maxStock: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { quantity: 'asc' },
    });

    let totalStock = 0;
    let totalValue = 0;
    let lowStock = 0;
    let outOfStock = 0;
    const hasReliableCost = inventories.some((i) => Number(i.product.buyingPrice) > 0);

    const products = inventories.map((inv) => {
      const qty = inv.quantity;
      totalStock += qty;

      const cost = Number(inv.product.buyingPrice);
      const value = cost > 0 ? cost * qty : 0;
      if (cost > 0) totalValue += value;

      let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      if (qty === 0) {
        status = 'out_of_stock';
        outOfStock++;
      } else if (inv.product.reorderLevel > 0 && qty <= inv.product.reorderLevel) {
        status = 'low_stock';
        lowStock++;
      } else if (inv.minThreshold > 0 && qty <= inv.minThreshold) {
        status = 'low_stock';
        lowStock++;
      }

      return {
        id: inv.id,
        productId: inv.productId,
        name: inv.product.name,
        sku: inv.product.sku,
        category: inv.product.category?.name || 'Uncategorized',
        currentStock: qty,
        minimumStock: inv.product.reorderLevel || inv.minThreshold,
        maximumStock: inv.product.maxStock || inv.maxThreshold,
        status,
        unitCost: cost,
        inventoryValue: value,
      };
    });

    return {
      summary: {
        totalProducts: inventories.length,
        totalStockQuantity: totalStock,
        totalValue: hasReliableCost ? totalValue : null,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
        hasReliableCost,
      },
      products,
    };
  }

  // ── Customer Credit Report ────────────────────────────

  async getCustomerCreditReport(businessId: string) {
    const customers = await this.prisma.customer.findMany({
      where: { businessId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        creditBalance: true,
        creditLimit: true,
        status: true,
      },
      orderBy: { creditBalance: 'desc' },
    });

    const customersWithCredit = customers.filter((c) => Number(c.creditBalance) > 0);

    const totalOutstanding = customersWithCredit.reduce(
      (sum, c) => sum + Number(c.creditBalance),
      0,
    );

    let approachingLimit = 0;
    let exceededLimit = 0;

    const customerDetails = customersWithCredit.map((c) => {
      const balance = Number(c.creditBalance);
      const limit = c.creditLimit ? Number(c.creditLimit) : null;
      const available = limit !== null ? limit - balance : null;

      let creditStatus: 'healthy' | 'approaching_limit' | 'exceeded_limit' = 'healthy';
      if (limit !== null) {
        const usagePercent = (balance / limit) * 100;
        if (usagePercent > 100) {
          creditStatus = 'exceeded_limit';
          exceededLimit++;
        } else if (usagePercent >= 80) {
          creditStatus = 'approaching_limit';
          approachingLimit++;
        }
      }

      return {
        id: c.id,
        name: `${c.firstName} ${c.lastName || ''}`.trim(),
        phone: c.phone,
        creditLimit: limit,
        outstanding: balance,
        availableCredit: available,
        status: creditStatus,
      };
    });

    return {
      summary: {
        totalOutstanding,
        customerCount: customersWithCredit.length,
        approachingLimit,
        exceededLimit,
      },
      customers: customerDetails,
    };
  }

  // ── Expenses Report ───────────────────────────────────

  async getExpensesReport(businessId: string, filters: ReportFilterDto) {
    const { start, end } = this.resolveDateRange(filters);

    const expenseCategories = await this.prisma.expenseCategory.findMany({
      where: { businessId, isActive: true },
    });

    if (expenseCategories.length === 0) {
      return {
        available: false,
        summary: { totalExpenses: 0, expenseCount: 0 },
        byCategory: [],
        byDate: [],
      };
    }

    const [summary, byCategory, byDate] = await Promise.all([
      this.prisma.expense.aggregate({
        where: { businessId, date: { gte: start, lt: end } },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.expense.groupBy({
        by: ['categoryId'],
        where: { businessId, date: { gte: start, lt: end } },
        _sum: { amount: true },
        _count: true,
      }),
      this.getExpensesTrendByRange(businessId, start, end),
    ]);

    const catMap = new Map(expenseCategories.map((c) => [c.id, c.name]));

    return {
      available: true,
      summary: {
        totalExpenses: Number(summary._sum.amount || 0),
        expenseCount: summary._count,
      },
      byCategory: byCategory.map((c) => ({
        id: c.categoryId,
        name: catMap.get(c.categoryId) || 'Unknown',
        totalAmount: Number(c._sum.amount || 0),
        count: c._count,
      })).sort((a, b) => b.totalAmount - a.totalAmount),
      byDate,
    };
  }

  private async getExpensesTrendByRange(businessId: string, start: Date, end: Date) {
    const days = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const limit = Math.min(days, 90);
    const trend: Array<{ date: string; amount: number }> = [];

    for (let i = 0; i < limit; i++) {
      const dayStart = new Date(start.getTime() + i * 86400000);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      if (dayStart >= end) break;

      const result = await this.prisma.expense.aggregate({
        where: { businessId, date: { gte: dayStart, lt: dayEnd } },
        _sum: { amount: true },
      });

      trend.push({
        date: dayStart.toISOString().slice(0, 10),
        amount: Number(result._sum.amount || 0),
      });
    }

    return trend;
  }

  // ── Profitability ─────────────────────────────────────

  async getProfitability(businessId: string, filters: ReportFilterDto) {
    const { start, end } = this.resolveDateRange(filters);

    const [salesResult, expensesResult] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { businessId, status: 'COMPLETED', createdAt: { gte: start, lt: end } },
        _sum: { totalAmount: true },
      }),
      this.prisma.expense.aggregate({
        where: { businessId, date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
    ]);

    const revenue = Number(salesResult._sum.totalAmount || 0);
    const expenses = Number(expensesResult._sum.amount || 0);

    return {
      revenue,
      expenses,
      estimatedProfit: revenue - expenses,
      hasExpenseData: expenses > 0,
    };
  }

  // ── Dashboard (kept for backward compat) ──────────────

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
      this.getOverview(businessId, { range: 'today' }),
      this.getSalesTrend(businessId),
      this.getRecentSales(businessId),
      this.getTopSellingProducts(businessId),
      this.getInventorySummary(businessId),
      this.getCustomerCreditSummary(businessId),
      this.getActivityFeed(businessId),
    ]);

    return {
      overview: {
        todaySales: overview.periodRevenue,
        todaySaleCount: overview.periodSaleCount,
        monthlyRevenue: overview.monthlyRevenue,
        totalProducts: overview.totalProducts,
        lowStockProducts: overview.lowStockProducts,
        totalCustomers: overview.totalCustomers,
        outstandingCredit: overview.outstandingCredit,
        totalExpenses: overview.totalExpenses,
        estimatedProfit: overview.estimatedProfit,
        revenueTrend: overview.revenueTrend,
      },
      salesTrend,
      recentSales,
      topSellingProducts,
      inventorySummary,
      customerCreditSummary,
      activityFeed,
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
          where: { businessId, status: 'COMPLETED', createdAt: { gte: dayStart, lt: dayEnd } },
          _sum: { totalAmount: true },
        }),
        this.prisma.expense.aggregate({
          where: { businessId, date: { gte: dayStart, lt: dayEnd } },
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
      include: { customer: { select: { firstName: true, lastName: true } } },
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
      where: { sale: { businessId, status: 'COMPLETED' } },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productIds = results.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, businessId },
      include: { category: { select: { name: true } } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    return results.map((r) => {
      const product = productMap.get(r.productId);
      return {
        id: r.productId,
        name: product?.name || 'Unknown Product',
        category: product?.category?.name || 'Uncategorized',
        quantitySold: r._sum.quantity || 0,
        revenue: Number(r._sum.totalPrice || 0),
      };
    });
  }

  private async getInventorySummary(businessId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: { product: { businessId, deletedAt: null } },
      include: {
        product: {
          select: { name: true, categoryId: true, category: { select: { name: true } } },
        },
      },
    });

    const categoryMap = new Map<string, { name: string; productCount: number; totalStock: number }>();

    for (const inv of inventories) {
      const catName = inv.product.category?.name || 'Uncategorized';
      const catId = inv.product.categoryId || 'uncategorized';
      if (!categoryMap.has(catId)) categoryMap.set(catId, { name: catName, productCount: 0, totalStock: 0 });
      const cat = categoryMap.get(catId)!;
      cat.productCount += 1;
      cat.totalStock += inv.quantity;
    }

    return Array.from(categoryMap.values());
  }

  private async getCustomerCreditSummary(businessId: string) {
    const customers = await this.prisma.customer.findMany({
      where: { businessId, deletedAt: null, creditBalance: { gt: 0 } },
      select: { id: true, firstName: true, lastName: true, creditBalance: true, creditLimit: true },
      orderBy: { creditBalance: 'desc' },
      take: 5,
    });

    return {
      totalOutstanding: customers.reduce((sum, c) => sum + Number(c.creditBalance), 0),
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
        where: { businessId, createdAt: { gte: threeHoursAgo } },
        include: { customer: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.inventoryTransaction.findMany({
        where: { businessId, createdAt: { gte: threeHoursAgo } },
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.payment.findMany({
        where: { businessId, createdAt: { gte: threeHoursAgo } },
        include: { customer: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const activities: Array<{
      id: string; action: string; target: string; time: string;
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
        STOCK_IN: 'Stock received', STOCK_OUT: 'Stock sold', ADJUSTMENT: 'Stock adjusted',
        DAMAGE: 'Damage recorded', LOSS: 'Loss recorded',
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
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
