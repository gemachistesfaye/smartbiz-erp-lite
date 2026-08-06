import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
  ) {}

  async findAll(businessId: string, query: ProductQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { barcode: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.unitId) {
      where.unitId = query.unitId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, color: true } },
          unit: { select: { id: true, name: true, symbol: true } },
          images: { where: { isPrimary: true }, take: 1 },
          inventory: { select: { quantity: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const productsWithPricing = products.map((product) => ({
      ...product,
      pricing: this.pricingService.calculateForProduct(product),
    }));

    return {
      data: productsWithPricing,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, businessId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, businessId, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        unit: { select: { id: true, name: true, symbol: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        inventory: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const pricing = this.pricingService.calculateForProduct(product);

    return { ...product, pricing };
  }

  async create(businessId: string, dto: CreateProductDto) {
    if (dto.sku) {
      const existingSku = await this.prisma.product.findFirst({
        where: { businessId, sku: dto.sku, deletedAt: null },
      });
      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    if (dto.barcode) {
      const existingBarcode = await this.prisma.product.findFirst({
        where: { businessId, barcode: dto.barcode, deletedAt: null },
      });
      if (existingBarcode) {
        throw new ConflictException('Product with this barcode already exists');
      }
    }

    let sku = dto.sku;
    if (!sku) {
      sku = await this.generateSku(businessId);
    }

    const pricingResult = this.pricingService.calculatePricing({
      buyingPrice: dto.buyingPrice || 0,
      quantityPurchased: dto.quantityPurchased || 1,
      transportationCost: dto.transportationCost || 0,
      loadingCost: dto.loadingCost || 0,
      packagingCost: dto.packagingCost || 0,
      storageCost: dto.storageCost || 0,
      laborCost: dto.laborCost || 0,
      customsCost: dto.customsCost || 0,
      otherCosts: dto.otherCosts || 0,
      vatPercentage: dto.vatPercentage || 0,
      profitPercentage: dto.profitPercentage || 0,
      sellingPrice: dto.sellingPrice,
      manualSellingPrice: dto.manualSellingPrice,
    });

    const product = await this.prisma.product.create({
      data: {
        businessId,
        name: dto.name,
        sku,
        barcode: dto.barcode,
        brand: dto.brand,
        categoryId: dto.categoryId,
        unitId: dto.unitId,
        description: dto.description,
        buyingPrice: dto.buyingPrice || 0,
        quantityPurchased: dto.quantityPurchased || 1,
        transportationCost: dto.transportationCost || 0,
        loadingCost: dto.loadingCost || 0,
        packagingCost: dto.packagingCost || 0,
        storageCost: dto.storageCost || 0,
        laborCost: dto.laborCost || 0,
        customsCost: dto.customsCost || 0,
        otherCosts: dto.otherCosts || 0,
        vatPercentage: dto.vatPercentage || 0,
        profitPercentage: dto.profitPercentage || 0,
        sellingPrice: pricingResult.recommendedSellingPrice,
        manualSellingPrice: dto.manualSellingPrice || false,
        reorderLevel: dto.reorderLevel || 0,
        maxStock: dto.maxStock,
        status: dto.status || 'ACTIVE',
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        unit: { select: { id: true, name: true, symbol: true } },
      },
    });

    return { ...product, pricing: pricingResult };
  }

  async update(id: string, businessId: string, dto: UpdateProductDto) {
    const existing = await this.findById(id, businessId);

    if (dto.sku && dto.sku !== existing.sku) {
      const skuConflict = await this.prisma.product.findFirst({
        where: { businessId, sku: dto.sku, deletedAt: null, id: { not: id } },
      });
      if (skuConflict) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    if (dto.barcode && dto.barcode !== existing.barcode) {
      const barcodeConflict = await this.prisma.product.findFirst({
        where: { businessId, barcode: dto.barcode, deletedAt: null, id: { not: id } },
      });
      if (barcodeConflict) {
        throw new ConflictException('Product with this barcode already exists');
      }
    }

    const mergedData = {
      buyingPrice: dto.buyingPrice !== undefined ? dto.buyingPrice : Number(existing.buyingPrice),
      quantityPurchased: dto.quantityPurchased !== undefined ? dto.quantityPurchased : existing.quantityPurchased,
      transportationCost: dto.transportationCost !== undefined ? dto.transportationCost : Number(existing.transportationCost),
      loadingCost: dto.loadingCost !== undefined ? dto.loadingCost : Number(existing.loadingCost),
      packagingCost: dto.packagingCost !== undefined ? dto.packagingCost : Number(existing.packagingCost),
      storageCost: dto.storageCost !== undefined ? dto.storageCost : Number(existing.storageCost),
      laborCost: dto.laborCost !== undefined ? dto.laborCost : Number(existing.laborCost),
      customsCost: dto.customsCost !== undefined ? dto.customsCost : Number(existing.customsCost),
      otherCosts: dto.otherCosts !== undefined ? dto.otherCosts : Number(existing.otherCosts),
      vatPercentage: dto.vatPercentage !== undefined ? dto.vatPercentage : Number(existing.vatPercentage),
      profitPercentage: dto.profitPercentage !== undefined ? dto.profitPercentage : Number(existing.profitPercentage),
      sellingPrice: dto.sellingPrice !== undefined ? dto.sellingPrice : Number(existing.sellingPrice),
      manualSellingPrice: dto.manualSellingPrice !== undefined ? dto.manualSellingPrice : existing.manualSellingPrice,
    };

    const pricingResult = this.pricingService.calculatePricing(mergedData);

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.sku !== undefined) updateData.sku = dto.sku;
    if (dto.barcode !== undefined) updateData.barcode = dto.barcode;
    if (dto.brand !== undefined) updateData.brand = dto.brand;
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.unitId !== undefined) updateData.unitId = dto.unitId;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.buyingPrice !== undefined) updateData.buyingPrice = dto.buyingPrice;
    if (dto.quantityPurchased !== undefined) updateData.quantityPurchased = dto.quantityPurchased;
    if (dto.transportationCost !== undefined) updateData.transportationCost = dto.transportationCost;
    if (dto.loadingCost !== undefined) updateData.loadingCost = dto.loadingCost;
    if (dto.packagingCost !== undefined) updateData.packagingCost = dto.packagingCost;
    if (dto.storageCost !== undefined) updateData.storageCost = dto.storageCost;
    if (dto.laborCost !== undefined) updateData.laborCost = dto.laborCost;
    if (dto.customsCost !== undefined) updateData.customsCost = dto.customsCost;
    if (dto.otherCosts !== undefined) updateData.otherCosts = dto.otherCosts;
    if (dto.vatPercentage !== undefined) updateData.vatPercentage = dto.vatPercentage;
    if (dto.profitPercentage !== undefined) updateData.profitPercentage = dto.profitPercentage;
    if (dto.manualSellingPrice !== undefined) updateData.manualSellingPrice = dto.manualSellingPrice;
    if (dto.reorderLevel !== undefined) updateData.reorderLevel = dto.reorderLevel;
    if (dto.maxStock !== undefined) updateData.maxStock = dto.maxStock;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    updateData.sellingPrice = pricingResult.recommendedSellingPrice;

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, color: true } },
        unit: { select: { id: true, name: true, symbol: true } },
      },
    });

    return { ...product, pricing: pricingResult };
  }

  async remove(id: string, businessId: string) {
    await this.findById(id, businessId);

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async restore(id: string, businessId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, businessId, deletedAt: { not: null } },
    });

    if (!product) {
      throw new NotFoundException('Deleted product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: null, isActive: true },
    });
  }

  async getStats(businessId: string) {
    const [total, active, inactive] = await Promise.all([
      this.prisma.product.count({ where: { businessId, deletedAt: null } }),
      this.prisma.product.count({ where: { businessId, deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.product.count({ where: { businessId, deletedAt: null, status: 'INACTIVE' } }),
    ]);

    return { total, active, inactive };
  }

  private async generateSku(businessId: string): Promise<string> {
    const count = await this.prisma.product.count({
      where: { businessId, deletedAt: null },
    });
    const nextNum = (count + 1).toString().padStart(5, '0');
    return `PRD-${nextNum}`;
  }
}
