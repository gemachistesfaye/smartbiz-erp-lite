import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(businessId: string, query?: { search?: string; page?: number; limit?: number }) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
      deletedAt: null,
    };

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { symbol: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      data: units,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, businessId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, businessId, deletedAt: null },
      include: { _count: { select: { products: true } } },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return unit;
  }

  async create(businessId: string, dto: CreateUnitDto) {
    const existing = await this.prisma.unit.findFirst({
      where: {
        businessId,
        symbol: { equals: dto.symbol, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Unit with this symbol already exists');
    }

    return this.prisma.unit.create({
      data: {
        businessId,
        name: dto.name,
        symbol: dto.symbol,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  async update(id: string, businessId: string, dto: UpdateUnitDto) {
    const unit = await this.findById(id, businessId);

    if (dto.symbol && dto.symbol !== unit.symbol) {
      const existing = await this.prisma.unit.findFirst({
        where: {
          businessId,
          symbol: { equals: dto.symbol, mode: 'insensitive' },
          deletedAt: null,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException('Unit with this symbol already exists');
      }
    }

    return this.prisma.unit.update({
      where: { id },
      data: {
        name: dto.name,
        symbol: dto.symbol,
        description: dto.description,
        isActive: dto.isActive,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  async remove(id: string, businessId: string) {
    await this.findById(id, businessId);

    const productCount = await this.prisma.product.count({
      where: { unitId: id, deletedAt: null },
    });

    if (productCount > 0) {
      throw new ConflictException(
        `Cannot delete unit with ${productCount} active product(s). Reassign or delete products first.`,
      );
    }

    return this.prisma.unit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, businessId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, businessId, deletedAt: { not: null } },
    });

    if (!unit) {
      throw new NotFoundException('Deleted unit not found');
    }

    return this.prisma.unit.update({
      where: { id },
      data: { deletedAt: null },
      include: { _count: { select: { products: true } } },
    });
  }
}
