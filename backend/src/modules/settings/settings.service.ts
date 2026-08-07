import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto, UpdateBusinessDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(businessId: string) {
    let settings = await this.prisma.businessSettings.findUnique({
      where: { businessId },
    });

    if (!settings) {
      settings = await this.prisma.businessSettings.create({
        data: { businessId },
      });
    }

    return settings;
  }

  async getBusiness(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        currency: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async updateSettings(businessId: string, dto: UpdateSettingsDto) {
    await this.getSettings(businessId);

    const updateData: any = {};
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.currencySymbol !== undefined) updateData.currencySymbol = dto.currencySymbol;
    if (dto.taxRate !== undefined) updateData.taxRate = dto.taxRate;
    if (dto.lowStockThreshold !== undefined) updateData.lowStockThreshold = dto.lowStockThreshold;
    if (dto.tinNumber !== undefined) updateData.tinNumber = dto.tinNumber || null;
    if (dto.vatNumber !== undefined) updateData.vatNumber = dto.vatNumber || null;
    if (dto.receiptHeader !== undefined) updateData.receiptHeader = dto.receiptHeader || null;
    if (dto.receiptFooter !== undefined) updateData.receiptFooter = dto.receiptFooter || null;

    const settings = await this.prisma.businessSettings.update({
      where: { businessId },
      data: updateData,
    });

    if (dto.currency) {
      await this.prisma.business.update({
        where: { id: businessId },
        data: { currency: dto.currency },
      });
    }

    return settings;
  }

  async updateBusiness(businessId: string, dto: UpdateBusinessDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone || null;
    if (dto.address !== undefined) updateData.address = dto.address || null;

    return this.prisma.business.update({
      where: { id: businessId },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        currency: true,
        isActive: true,
      },
    });
  }
}
