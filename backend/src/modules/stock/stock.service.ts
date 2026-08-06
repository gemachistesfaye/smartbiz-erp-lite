import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateStockReceivingDto,
  StockReceivingQueryDto,
  CreateStockAdjustmentDto,
} from './dto/stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async receiveStock(businessId: string, userId: string, dto: CreateStockReceivingDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    const subtotal = dto.items.reduce((sum, item) => sum + item.quantity * item.buyingPrice, 0);
    const additionalCosts = (dto.transportationCost || 0) + (dto.packagingCost || 0) +
      (dto.storageCost || 0) + (dto.laborCost || 0) + (dto.otherCosts || 0);
    const totalCost = subtotal + additionalCosts;

    const result = await this.prisma.$transaction(async (tx) => {
      const receiving = await tx.stockReceiving.create({
        data: {
          businessId,
          supplierId: dto.supplierId,
          purchaseReference: dto.purchaseReference,
          date: dto.date ? new Date(dto.date) : new Date(),
          subtotal,
          transportationCost: dto.transportationCost || 0,
          packagingCost: dto.packagingCost || 0,
          storageCost: dto.storageCost || 0,
          laborCost: dto.laborCost || 0,
          otherCosts: dto.otherCosts || 0,
          totalCost,
          notes: dto.notes,
          status: 'RECEIVED',
          userId,
        },
      });

      for (const item of dto.items) {
        await tx.stockReceivingItem.create({
          data: {
            stockReceivingId: receiving.id,
            productId: item.productId,
            quantity: item.quantity,
            buyingPrice: item.buyingPrice,
            totalCost: item.quantity * item.buyingPrice,
          },
        });

        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId },
        });

        const previousQuantity = inventory?.quantity || 0;
        const newQuantity = previousQuantity + item.quantity;

        if (inventory) {
          const newInventoryValue = Number(inventory.averageCost) * previousQuantity +
            item.buyingPrice * item.quantity;
          const newAverageCost = newQuantity > 0 ? newInventoryValue / newQuantity : 0;

          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: newQuantity,
              averageCost: newAverageCost,
              inventoryValue: newAverageCost * newQuantity,
              lastUpdated: new Date(),
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              averageCost: item.buyingPrice,
              inventoryValue: item.buyingPrice * item.quantity,
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
            referenceId: receiving.id,
            referenceType: 'STOCK_RECEIVING',
            reason: `Stock received via ${dto.purchaseReference || 'stock receiving'}`,
            userId,
          },
        });
      }

      return receiving;
    });

    return this.findById(result.id, businessId);
  }

  async findAllReceivings(businessId: string, query: StockReceivingQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { businessId };

    if (query.search) {
      where.OR = [
        { purchaseReference: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.supplierId) {
      where.supplierId = query.supplierId;
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [receivings, total] = await Promise.all([
      this.prisma.stockReceiving.findMany({
        where,
        include: {
          supplier: { select: { id: true, name: true, companyName: true } },
          user: { select: { id: true, firstName: true, lastName: true } },
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
      this.prisma.stockReceiving.count({ where }),
    ]);

    return {
      data: receivings,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findReceivingById(id: string, businessId: string) {
    const receiving = await this.prisma.stockReceiving.findFirst({
      where: { id, businessId },
      include: {
        supplier: { select: { id: true, name: true, companyName: true, phone: true, email: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true, unit: { select: { symbol: true } } } },
          },
        },
      },
    });

    if (!receiving) {
      throw new NotFoundException('Stock receiving not found');
    }

    return receiving;
  }

  async cancelReceiving(id: string, businessId: string, userId: string) {
    const receiving = await this.findReceivingById(id, businessId);

    if (receiving.status === 'CANCELLED') {
      throw new BadRequestException('Stock receiving is already cancelled');
    }

    if (receiving.status === 'RECEIVED') {
      return this.prisma.$transaction(async (tx) => {
        for (const item of receiving.items) {
          const inventory = await tx.inventory.findUnique({
            where: { productId: item.productId },
          });

          if (!inventory || inventory.quantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.product.name} to cancel receiving`,
            );
          }

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
              referenceId: id,
              referenceType: 'STOCK_RECEIVING_CANCEL',
              reason: `Stock receiving ${id} cancelled`,
              userId,
            },
          });
        }

        return tx.stockReceiving.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });
      });
    }

    return this.prisma.stockReceiving.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async adjustStock(businessId: string, userId: string, dto: CreateStockAdjustmentDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: dto.productId },
      include: {
        product: { select: { name: true, businessId: true } },
      },
    });

    if (!inventory || inventory.product.businessId !== businessId) {
      throw new NotFoundException('Product inventory not found');
    }

    const isIncrease = dto.quantity > 0;
    const absQuantity = Math.abs(dto.quantity);
    const previousQuantity = inventory.quantity;
    const newQuantity = isIncrease ? previousQuantity + absQuantity : previousQuantity - absQuantity;

    if (newQuantity < 0) {
      throw new BadRequestException('Adjustment would result in negative stock');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const newInventoryValue = Number(inventory.averageCost) * newQuantity;

      await tx.inventory.update({
        where: { productId: dto.productId },
        data: {
          quantity: newQuantity,
          inventoryValue: newInventoryValue,
          lastUpdated: new Date(),
        },
      });

      const adjustment = await tx.stockAdjustment.create({
        data: {
          businessId,
          productId: dto.productId,
          type: dto.type as any,
          quantity: dto.quantity,
          reason: dto.reason,
          notes: dto.notes,
          userId,
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          businessId,
          productId: dto.productId,
          type: dto.type as any,
          quantity: dto.quantity,
          quantityBefore: previousQuantity,
          quantityAfter: newQuantity,
          referenceId: adjustment.id,
          referenceType: 'STOCK_ADJUSTMENT',
          reason: dto.reason,
          userId,
        },
      });

      return adjustment;
    });

    return result;
  }

  private async findById(id: string, businessId: string) {
    return this.prisma.stockReceiving.findFirst({
      where: { id, businessId },
      include: {
        supplier: { select: { id: true, name: true, companyName: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true, unit: { select: { symbol: true } } } },
          },
        },
      },
    });
  }
}
