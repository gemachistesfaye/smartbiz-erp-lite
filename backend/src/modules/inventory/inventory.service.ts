import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryQueryDto, UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(businessId: string, query: InventoryQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      product: { businessId, deletedAt: null },
    };

    if (query.search) {
      where.product.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.stockStatus) {
      switch (query.stockStatus) {
        case 'out':
          where.quantity = 0;
          break;
        case 'low':
          where.AND = [
            { quantity: { gt: 0 } },
            { minThreshold: { gt: 0 } },
          ];
          break;
        case 'overstock':
          where.AND = [
            { maxThreshold: { not: null } },
          ];
          break;
      }
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.updatedAt = 'desc';
    }

    const [inventories, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              barcode: true,
              reorderLevel: true,
              maxStock: true,
              sellingPrice: true,
              buyingPrice: true,
              unit: { select: { name: true, symbol: true } },
              category: { select: { name: true, color: true } },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.inventory.count({ where }),
    ]);

    const enrichedInventories = inventories.map((inv) => {
      const available = inv.quantity - inv.reservedQuantity;
      let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock' = 'in_stock';
      if (inv.quantity === 0) stockStatus = 'out_of_stock';
      else if (inv.product.reorderLevel > 0 && inv.quantity <= inv.product.reorderLevel) stockStatus = 'low_stock';
      else if (inv.product.maxStock && inv.quantity > inv.product.maxStock) stockStatus = 'overstock';

      return {
        ...inv,
        availableQuantity: available,
        stockStatus,
      };
    });

    return {
      data: enrichedInventories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByProductId(productId: string, businessId: string) {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        productId,
        product: { businessId, deletedAt: null },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            barcode: true,
            reorderLevel: true,
            maxStock: true,
            sellingPrice: true,
            buyingPrice: true,
            unit: { select: { name: true, symbol: true } },
            category: { select: { name: true, color: true } },
          },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    const available = inventory.quantity - inventory.reservedQuantity;
    let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock' = 'in_stock';
    if (inventory.quantity === 0) stockStatus = 'out_of_stock';
    else if (inventory.product.reorderLevel > 0 && inventory.quantity <= inventory.product.reorderLevel) stockStatus = 'low_stock';
    else if (inventory.product.maxStock && inventory.quantity > inventory.product.maxStock) stockStatus = 'overstock';

    return {
      ...inventory,
      availableQuantity: available,
      stockStatus,
    };
  }

  async update(productId: string, businessId: string, dto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        productId,
        product: { businessId, deletedAt: null },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    return this.prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        minThreshold: dto.minThreshold !== undefined ? dto.minThreshold : inventory.minThreshold,
        maxThreshold: dto.maxThreshold !== undefined ? dto.maxThreshold : inventory.maxThreshold,
      },
    });
  }

  async getLowStock(businessId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: {
        product: { businessId, deletedAt: null },
        quantity: { gt: 0 },
        minThreshold: { gt: 0 },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            reorderLevel: true,
            maxStock: true,
            unit: { select: { name: true, symbol: true } },
          },
        },
      },
    });

    return inventories.filter((inv) => inv.quantity <= inv.minThreshold);
  }

  async getOutOfStock(businessId: string) {
    return this.prisma.inventory.findMany({
      where: {
        product: { businessId, deletedAt: null },
        quantity: 0,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            reorderLevel: true,
            unit: { select: { name: true, symbol: true } },
          },
        },
      },
    });
  }

  async getStats(businessId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: {
        product: { businessId, deletedAt: null },
      },
      include: {
        product: {
          select: {
            buyingPrice: true,
            reorderLevel: true,
            maxStock: true,
          },
        },
      },
    });

    let lowStock = 0;
    let outOfStock = 0;
    let overstock = 0;
    let totalValue = 0;

    for (const inv of inventories) {
      if (inv.quantity === 0) {
        outOfStock++;
      } else if (inv.product.reorderLevel > 0 && inv.quantity <= inv.product.reorderLevel) {
        lowStock++;
      }
      if (inv.product.maxStock && inv.quantity > inv.product.maxStock) {
        overstock++;
      }
      totalValue += Number(inv.inventoryValue);
    }

    return {
      totalProducts: inventories.length,
      lowStock,
      outOfStock,
      overstock,
      totalValue,
    };
  }
}
