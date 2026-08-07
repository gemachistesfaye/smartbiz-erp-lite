import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async createSale(businessId: string, userId: string, dto: CreateSaleDto) {
    if (dto.paymentMethod === 'CREDIT' && !dto.customerId) {
      throw new BadRequestException('Customer is required for credit sales');
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const todaySaleCount = await this.prisma.sale.count({
      where: {
        businessId,
        createdAt: { gte: todayStart, lt: todayEnd },
      },
    });
    const seq = (todaySaleCount + 1).toString().padStart(4, '0');
    const saleNumber = `SB-${dateStr}-${seq}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, businessId },
      });

      if (products.length !== productIds.length) {
        const foundIds = new Set(products.map((p) => p.id));
        const missing = productIds.filter((id) => !foundIds.has(id));
        throw new BadRequestException(`Products not found: ${missing.join(', ')}`);
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      const inventories = await tx.inventory.findMany({
        where: { productId: { in: productIds } },
      });
      const inventoryMap = new Map(inventories.map((inv) => [inv.productId, inv]));

      const saleItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }> = [];

      for (const item of dto.items) {
        const product = productMap.get(item.productId)!;
        const inventory = inventoryMap.get(item.productId);

        const currentStock = inventory?.quantity || 0;
        if (currentStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${currentStock}, requested: ${item.quantity}`,
          );
        }

        const unitPrice = Number(product.sellingPrice);
        const totalPrice = unitPrice * item.quantity;

        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      }

      const subtotal = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const discountAmount = dto.discountAmount || 0;
      const totalAmount = subtotal - discountAmount;

      if (totalAmount < 0) {
        throw new BadRequestException('Discount cannot exceed subtotal');
      }

      const sale = await tx.sale.create({
        data: {
          businessId,
          cashierId: userId,
          customerId: dto.customerId || null,
          saleNumber,
          paymentMethod: dto.paymentMethod,
          subtotal,
          taxAmount: 0,
          discountAmount,
          totalAmount,
          status: 'COMPLETED',
          notes: dto.notes || null,
        },
      });

      for (const item of saleItems) {
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          },
        });
      }

      for (const item of saleItems) {
        const inventory = inventoryMap.get(item.productId)!;
        const previousQuantity = inventory.quantity;
        const newQuantity = previousQuantity - item.quantity;

        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: newQuantity,
            inventoryValue: Number(inventory.averageCost) * newQuantity,
            lastUpdated: new Date(),
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            businessId,
            productId: item.productId,
            type: 'STOCK_OUT',
            quantity: -item.quantity,
            quantityBefore: previousQuantity,
            quantityAfter: newQuantity,
            referenceId: sale.id,
            referenceType: 'SALE',
            reason: `Sale ${saleNumber}`,
            userId,
          },
        });
      }

      if (dto.paymentMethod === 'CREDIT' && dto.customerId) {
        const customer = await tx.customer.findFirst({
          where: { id: dto.customerId, businessId },
        });

        if (!customer) {
          throw new BadRequestException('Customer not found');
        }

        if (customer.status !== 'ACTIVE') {
          throw new BadRequestException('Customer is not active');
        }

        const totalCreditResult = await tx.sale.aggregate({
          where: {
            customerId: dto.customerId,
            businessId,
            paymentMethod: 'CREDIT',
            status: 'COMPLETED',
          },
          _sum: { totalAmount: true },
        });

        const totalPaidResult = await tx.payment.aggregate({
          where: {
            customerId: dto.customerId,
            businessId,
            type: 'INCOMING',
          },
          _sum: { amount: true },
        });

        const totalCredit = Number(totalCreditResult._sum.totalAmount || 0);
        const totalPaid = Number(totalPaidResult._sum.amount || 0);
        const currentOutstanding = totalCredit - totalPaid;
        const newOutstanding = currentOutstanding + totalAmount;

        const creditLimit = customer.creditLimit ? Number(customer.creditLimit) : null;
        if (creditLimit !== null && newOutstanding > creditLimit) {
          throw new BadRequestException(
            `Credit limit exceeded. Available: ${creditLimit - currentOutstanding}, requested: ${totalAmount}`,
          );
        }

        await tx.customer.update({
          where: { id: dto.customerId },
          data: { creditBalance: newOutstanding },
        });
      }

      await tx.payment.create({
        data: {
          businessId,
          saleId: sale.id,
          customerId: dto.customerId || null,
          type: 'INCOMING',
          method: dto.paymentMethod,
          amount: totalAmount,
          userId,
        },
      });

      return sale;
    });

    return this.findById(result.id, businessId);
  }

  async findAll(businessId: string, query: SaleQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { businessId };

    if (query.search) {
      where.OR = [
        { customerId: { equals: query.search } },
        { customer: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          cashier: {
            select: { id: true, firstName: true, lastName: true },
          },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.sale.count({ where }),
    ]);

    return {
      data: sales,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, businessId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, businessId },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, phone: true, email: true },
        },
        cashier: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true, sellingPrice: true } },
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async cancelSale(id: string, businessId: string, userId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, businessId },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (sale.status !== 'COMPLETED') {
      throw new BadRequestException('Only completed sales can be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of sale.items) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId },
        });

        const previousQuantity = inventory?.quantity || 0;
        const newQuantity = previousQuantity + item.quantity;

        if (inventory) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: newQuantity,
              inventoryValue: Number(inventory.averageCost) * newQuantity,
              lastUpdated: new Date(),
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              lastUpdated: new Date(),
            },
          });
        }

        await tx.inventoryTransaction.create({
          data: {
            businessId,
            productId: item.productId,
            type: 'STOCK_IN',
            quantity: item.quantity,
            quantityBefore: previousQuantity,
            quantityAfter: newQuantity,
            referenceId: id,
            referenceType: 'SALE_CANCEL',
            reason: `Sale ${id} cancelled`,
            userId,
          },
        });
      }

      if (sale.paymentMethod === 'CREDIT' && sale.customerId) {
        const customer = await tx.customer.findFirst({
          where: { id: sale.customerId },
        });

        if (customer) {
          const currentBalance = Number(customer.creditBalance);
          const newBalance = currentBalance - Number(sale.totalAmount);
          await tx.customer.update({
            where: { id: sale.customerId },
            data: { creditBalance: Math.max(0, newBalance) },
          });
        }
      }

      await tx.payment.create({
        data: {
          businessId,
          saleId: sale.id,
          customerId: sale.customerId || null,
          type: 'OUTGOING',
          method: sale.paymentMethod,
          amount: Number(sale.totalAmount),
          notes: `Refund for cancelled sale`,
          userId,
        },
      });

      return tx.sale.update({
        where: { id },
        data: { status: 'VOIDED' },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          cashier: {
            select: { id: true, firstName: true, lastName: true },
          },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
        },
      });
    });
  }
}
