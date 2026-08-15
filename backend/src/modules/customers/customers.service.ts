import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
  CreatePaymentDto,
} from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(businessId: string, query: CustomerQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.hasBalance) {
      where.creditBalance = { gt: 0 };
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllActive(businessId: string) {
    return this.prisma.customer.findMany({
      where: { businessId, deletedAt: null, status: 'ACTIVE' },
      orderBy: { firstName: 'asc' },
    });
  }

  async findById(id: string, businessId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async getCustomerDetails(id: string, businessId: string) {
    const customer = await this.findById(id, businessId);

    const [totalCreditResult, totalPaidResult, lastPayment, purchaseStats, lastSale] = await Promise.all([
      this.prisma.sale.aggregate({
        where: {
          customerId: id,
          businessId,
          paymentMethod: 'CREDIT',
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          customerId: id,
          businessId,
          type: 'INCOMING',
        },
        _sum: { amount: true },
      }),
      this.prisma.payment.findFirst({
        where: {
          customerId: id,
          businessId,
          type: 'INCOMING',
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.sale.aggregate({
        where: {
          customerId: id,
          businessId,
          status: 'COMPLETED',
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.sale.findFirst({
        where: {
          customerId: id,
          businessId,
          status: 'COMPLETED',
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    const totalCredit = Number(totalCreditResult._sum.totalAmount || 0);
    const totalPaid = Number(totalPaidResult._sum.amount || 0);
    const outstandingBalance = totalCredit - totalPaid;
    const creditLimit = customer.creditLimit ? Number(customer.creditLimit) : null;
    const availableCredit = creditLimit !== null ? creditLimit - outstandingBalance : null;

    return {
      ...customer,
      totalCredit,
      totalPaid,
      outstandingBalance,
      availableCredit,
      lastPaymentDate: lastPayment?.createdAt || null,
      totalPurchases: purchaseStats._count,
      totalPurchaseAmount: Number(purchaseStats._sum.totalAmount || 0),
      lastPurchaseDate: lastSale?.createdAt || null,
    };
  }

  async create(businessId: string, dto: CreateCustomerDto) {
    if (dto.phone) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          businessId,
          phone: dto.phone,
          deletedAt: null,
        },
      });
      if (existing) {
        throw new ConflictException('Customer with this phone number already exists');
      }
    }

    if (dto.email) {
      const existingEmail = await this.prisma.customer.findFirst({
        where: {
          businessId,
          email: dto.email,
          deletedAt: null,
        },
      });
      if (existingEmail) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    return this.prisma.customer.create({
      data: {
        businessId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        creditLimit: dto.creditLimit,
        notes: dto.notes,
        status: dto.status || 'ACTIVE',
      },
    });
  }

  async update(id: string, businessId: string, dto: UpdateCustomerDto) {
    const existing = await this.findById(id, businessId);

    if (dto.phone && dto.phone !== existing.phone) {
      const phoneConflict = await this.prisma.customer.findFirst({
        where: {
          businessId,
          phone: dto.phone,
          deletedAt: null,
          id: { not: id },
        },
      });
      if (phoneConflict) {
        throw new ConflictException('Customer with this phone number already exists');
      }
    }

    if (dto.email && dto.email !== existing.email) {
      const emailConflict = await this.prisma.customer.findFirst({
        where: {
          businessId,
          email: dto.email,
          deletedAt: null,
          id: { not: id },
        },
      });
      if (emailConflict) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    const updateData: any = {};
    if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
    if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.creditLimit !== undefined) updateData.creditLimit = dto.creditLimit;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.status !== undefined) updateData.status = dto.status;

    return this.prisma.customer.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, businessId: string) {
    await this.findById(id, businessId);

    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
  }

  async restore(id: string, businessId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, businessId, deletedAt: { not: null } },
    });

    if (!customer) {
      throw new NotFoundException('Deleted customer not found');
    }

    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: null, status: 'ACTIVE' },
    });
  }

  async getStats(businessId: string) {
    const [total, active, inactive, blocked, withBalance] = await Promise.all([
      this.prisma.customer.count({ where: { businessId, deletedAt: null } }),
      this.prisma.customer.count({ where: { businessId, deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.customer.count({ where: { businessId, deletedAt: null, status: 'INACTIVE' } }),
      this.prisma.customer.count({ where: { businessId, deletedAt: null, status: 'BLOCKED' } }),
      this.prisma.customer.count({ where: { businessId, deletedAt: null, creditBalance: { gt: 0 } } }),
    ]);

    return { total, active, inactive, blocked, withBalance };
  }

  async recordPayment(id: string, businessId: string, userId: string, dto: CreatePaymentDto) {
    const customer = await this.findById(id, businessId);

    if (customer.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot record payment for inactive or blocked customer');
    }

    const totalCreditResult = await this.prisma.sale.aggregate({
      where: {
        customerId: id,
        businessId,
        paymentMethod: 'CREDIT',
      },
      _sum: { totalAmount: true },
    });

    const totalPaidResult = await this.prisma.payment.aggregate({
      where: {
        customerId: id,
        businessId,
        type: 'INCOMING',
      },
      _sum: { amount: true },
    });

    const totalCredit = Number(totalCreditResult._sum.totalAmount || 0);
    const totalPaid = Number(totalPaidResult._sum.amount || 0);
    const outstandingBalance = totalCredit - totalPaid;

    if (dto.amount > outstandingBalance) {
      throw new BadRequestException(
        `Payment amount (${dto.amount}) exceeds outstanding balance (${outstandingBalance})`,
      );
    }

    const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();

    const payment = await this.prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          businessId,
          customerId: id,
          userId,
          type: 'INCOMING',
          method: dto.method,
          amount: dto.amount,
          reference: dto.reference,
          notes: dto.notes,
          createdAt: paymentDate,
        },
      });

      const newBalance = outstandingBalance - dto.amount;
      await tx.customer.update({
        where: { id },
        data: { creditBalance: newBalance },
      });

      return newPayment;
    });

    return payment;
  }

  async getPaymentHistory(id: string, businessId: string, query: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    await this.findById(id, businessId);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      customerId: id,
      businessId,
      type: 'INCOMING',
    };

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCreditHistory(id: string, businessId: string) {
    await this.findById(id, businessId);

    const [sales, payments] = await Promise.all([
      this.prisma.sale.findMany({
        where: {
          customerId: id,
          businessId,
          paymentMethod: 'CREDIT',
        },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
          status: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.findMany({
        where: {
          customerId: id,
          businessId,
          type: 'INCOMING',
        },
        select: {
          id: true,
          amount: true,
          method: true,
          createdAt: true,
          reference: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const activities = [
      ...sales.map((s) => ({
        id: s.id,
        type: 'CREDIT_SALE' as const,
        amount: Number(s.totalAmount),
        date: s.createdAt,
        description: `Credit sale`,
        status: s.status,
      })),
      ...payments.map((p) => ({
        id: p.id,
        type: 'PAYMENT' as const,
        amount: Number(p.amount),
        date: p.createdAt,
        description: `Payment via ${p.method.toLowerCase().replace('_', ' ')}`,
        reference: p.reference,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let balance = 0;
    for (const activity of [...activities].reverse()) {
      if (activity.type === 'CREDIT_SALE') {
        balance += activity.amount;
      } else {
        balance -= activity.amount;
      }
    }

    return {
      activities,
      currentBalance: balance,
    };
  }

  async canUseCredit(customerId: string, businessId: string, amount: number) {
    const customer = await this.findById(customerId, businessId);

    const totalCreditResult = await this.prisma.sale.aggregate({
      where: {
        customerId: customerId,
        businessId,
        paymentMethod: 'CREDIT',
      },
      _sum: { totalAmount: true },
    });

    const totalPaidResult = await this.prisma.payment.aggregate({
      where: {
        customerId: customerId,
        businessId,
        type: 'INCOMING',
      },
      _sum: { amount: true },
    });

    const totalCredit = Number(totalCreditResult._sum.totalAmount || 0);
    const totalPaid = Number(totalPaidResult._sum.amount || 0);
    const outstandingBalance = totalCredit - totalPaid;
    const creditLimit = customer.creditLimit ? Number(customer.creditLimit) : null;
    const availableCredit = creditLimit !== null ? creditLimit - outstandingBalance : null;
    const allowed = availableCredit !== null ? amount <= availableCredit : true;

    return {
      allowed,
      currentBalance: outstandingBalance,
      creditLimit,
      availableCredit,
      requestedAmount: amount,
    };
  }

  async getOverdueCustomers(businessId: string) {
    const now = new Date();
    
    const overdueSales = await this.prisma.sale.findMany({
      where: {
        businessId,
        paymentMethod: 'CREDIT',
        status: 'COMPLETED',
        dueDate: { lt: now },
        customerId: { not: null },
      },
      select: {
        id: true,
        customerId: true,
        totalAmount: true,
        dueDate: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            creditBalance: true,
            creditLimit: true,
            status: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const customerMap = new Map<string, {
      customer: typeof overdueSales[0]['customer'];
      outstandingBalance: number;
      earliestDueDate: Date;
      daysOverdue: number;
      saleCount: number;
    }>();

    for (const sale of overdueSales) {
      if (!sale.customer || Number(sale.customer.creditBalance) <= 0) continue;
      
      const existing = customerMap.get(sale.customerId!);
      const daysOverdue = Math.floor((now.getTime() - new Date(sale.dueDate!).getTime()) / (1000 * 60 * 60 * 24));
      
      if (existing) {
        existing.outstandingBalance = Number(sale.customer.creditBalance);
        existing.saleCount++;
        if (new Date(sale.dueDate!) < existing.earliestDueDate) {
          existing.earliestDueDate = new Date(sale.dueDate!);
          existing.daysOverdue = daysOverdue;
        }
      } else {
        customerMap.set(sale.customerId!, {
          customer: sale.customer,
          outstandingBalance: Number(sale.customer.creditBalance),
          earliestDueDate: new Date(sale.dueDate!),
          daysOverdue,
          saleCount: 1,
        });
      }
    }

    return Array.from(customerMap.values()).map((entry) => ({
      ...entry.customer,
      outstandingBalance: entry.outstandingBalance,
      dueDate: entry.earliestDueDate.toISOString(),
      daysOverdue: entry.daysOverdue,
      saleCount: entry.saleCount,
    }));
  }
}
