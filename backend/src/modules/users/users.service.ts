import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByBusinessId(businessId: string) {
    return this.prisma.user.findMany({
      where: { businessId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    businessId: string;
    role?: 'OWNER' | 'MANAGER' | 'CASHIER';
    phone?: string;
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        businessId: data.businessId,
        role: data.role || 'CASHIER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        businessId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: string,
    businessId: string,
    data: {
      firstName?: string;
      lastName?: string;
      role?: 'OWNER' | 'MANAGER' | 'CASHIER';
      phone?: string;
      isActive?: boolean;
    },
  ) {
    const user = await this.findById(id);

    if (user.businessId !== businessId) {
      throw new ForbiddenException('Cannot modify users from other businesses');
    }

    if (data.role && user.role === 'OWNER') {
      throw new ForbiddenException('Cannot change the role of an owner');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        businessId: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async deactivate(id: string, businessId: string) {
    const user = await this.findById(id);

    if (user.businessId !== businessId) {
      throw new ForbiddenException('Cannot modify users from other businesses');
    }

    if (user.role === 'OWNER') {
      throw new ForbiddenException('Cannot deactivate the owner');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }

  async activate(id: string, businessId: string) {
    const user = await this.findById(id);

    if (user.businessId !== businessId) {
      throw new ForbiddenException('Cannot modify users from other businesses');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }

  async remove(id: string, businessId: string) {
    const user = await this.findById(id);

    if (user.businessId !== businessId) {
      throw new ForbiddenException('Cannot delete users from other businesses');
    }

    if (user.role === 'OWNER') {
      throw new ForbiddenException('Cannot delete the owner');
    }

    await this.prisma.refreshToken.deleteMany({ where: { userId: id } });

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }
}
