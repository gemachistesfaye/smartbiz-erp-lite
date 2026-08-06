import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(businessId: string, query: SupplierQueryDto) {
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
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
      ];
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

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        include: {
          _count: { select: { purchases: true, stockReceivings: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data: suppliers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllActive(businessId: string) {
    return this.prisma.supplier.findMany({
      where: { businessId, deletedAt: null, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, businessId: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, businessId, deletedAt: null },
      include: {
        _count: { select: { purchases: true, stockReceivings: true } },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async create(businessId: string, dto: CreateSupplierDto) {
    const existing = await this.prisma.supplier.findFirst({
      where: {
        businessId,
        name: { equals: dto.name, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Supplier with this name already exists');
    }

    if (dto.tin) {
      const existingTin = await this.prisma.supplier.findFirst({
        where: {
          businessId,
          tin: dto.tin,
          deletedAt: null,
        },
      });
      if (existingTin) {
        throw new ConflictException('Supplier with this TIN already exists');
      }
    }

    return this.prisma.supplier.create({
      data: {
        businessId,
        name: dto.name,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        phone: dto.phone,
        email: dto.email,
        tin: dto.tin,
        address: dto.address,
        city: dto.city,
        notes: dto.notes,
        status: dto.status || 'ACTIVE',
      },
    });
  }

  async update(id: string, businessId: string, dto: UpdateSupplierDto) {
    const existing = await this.findById(id, businessId);

    if (dto.name && dto.name !== existing.name) {
      const nameConflict = await this.prisma.supplier.findFirst({
        where: {
          businessId,
          name: { equals: dto.name, mode: 'insensitive' },
          deletedAt: null,
          id: { not: id },
        },
      });
      if (nameConflict) {
        throw new ConflictException('Supplier with this name already exists');
      }
    }

    if (dto.tin && dto.tin !== existing.tin) {
      const tinConflict = await this.prisma.supplier.findFirst({
        where: {
          businessId,
          tin: dto.tin,
          deletedAt: null,
          id: { not: id },
        },
      });
      if (tinConflict) {
        throw new ConflictException('Supplier with this TIN already exists');
      }
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.companyName !== undefined) updateData.companyName = dto.companyName;
    if (dto.contactPerson !== undefined) updateData.contactPerson = dto.contactPerson;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.tin !== undefined) updateData.tin = dto.tin;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.city !== undefined) updateData.city = dto.city;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.prisma.supplier.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, businessId: string) {
    await this.findById(id, businessId);

    return this.prisma.supplier.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async restore(id: string, businessId: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, businessId, deletedAt: { not: null } },
    });

    if (!supplier) {
      throw new NotFoundException('Deleted supplier not found');
    }

    return this.prisma.supplier.update({
      where: { id },
      data: { deletedAt: null, isActive: true },
    });
  }

  async getStats(businessId: string) {
    const [total, active, inactive] = await Promise.all([
      this.prisma.supplier.count({ where: { businessId, deletedAt: null } }),
      this.prisma.supplier.count({ where: { businessId, deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.supplier.count({ where: { businessId, deletedAt: null, status: 'INACTIVE' } }),
    ]);

    return { total, active, inactive };
  }
}
