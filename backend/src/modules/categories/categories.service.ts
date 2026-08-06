import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
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
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, businessId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, businessId, deletedAt: null },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(businessId: string, dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: {
        businessId,
        name: { equals: dto.name, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: {
        businessId,
        name: dto.name,
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
        isActive: dto.isActive ?? true,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  async update(id: string, businessId: string, dto: UpdateCategoryDto) {
    const category = await this.findById(id, businessId);

    if (dto.name && dto.name !== category.name) {
      const existing = await this.prisma.category.findFirst({
        where: {
          businessId,
          name: { equals: dto.name, mode: 'insensitive' },
          deletedAt: null,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
        isActive: dto.isActive,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  async remove(id: string, businessId: string) {
    await this.findById(id, businessId);

    const productCount = await this.prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (productCount > 0) {
      throw new ConflictException(
        `Cannot delete category with ${productCount} active product(s). Reassign or delete products first.`,
      );
    }

    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, businessId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, businessId, deletedAt: { not: null } },
    });

    if (!category) {
      throw new NotFoundException('Deleted category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: null },
      include: { _count: { select: { products: true } } },
    });
  }
}
