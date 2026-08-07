import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseQueryDto } from './dto/expense.dto';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-category.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Categories ────────────────────────────────────────

  async getCategories(businessId: string) {
    return this.prisma.expenseCategory.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { expenses: true } },
      },
    });
  }

  async getCategoryById(id: string, businessId: string) {
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id, businessId, isActive: true },
      include: {
        _count: { select: { expenses: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('Expense category not found');
    }

    return category;
  }

  async createCategory(businessId: string, dto: CreateExpenseCategoryDto) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { businessId, name: { equals: dto.name, mode: 'insensitive' } },
    });

    if (existing) {
      throw new ConflictException('A category with this name already exists');
    }

    return this.prisma.expenseCategory.create({
      data: { businessId, name: dto.name.trim() },
    });
  }

  async updateCategory(id: string, businessId: string, dto: UpdateExpenseCategoryDto) {
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id, businessId, isActive: true },
    });

    if (!category) {
      throw new NotFoundException('Expense category not found');
    }

    if (dto.name !== category.name) {
      const duplicate = await this.prisma.expenseCategory.findFirst({
        where: { businessId, name: { equals: dto.name, mode: 'insensitive' }, id: { not: id } },
      });
      if (duplicate) {
        throw new ConflictException('A category with this name already exists');
      }
    }

    return this.prisma.expenseCategory.update({
      where: { id },
      data: { name: dto.name.trim() },
    });
  }

  async deleteCategory(id: string, businessId: string) {
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id, businessId, isActive: true },
      include: { _count: { select: { expenses: true } } },
    });

    if (!category) {
      throw new NotFoundException('Expense category not found');
    }

    if (category._count.expenses > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" — it has ${category._count.expenses} expense(s). Reassign or remove them first.`,
      );
    }

    return this.prisma.expenseCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ── Expenses ──────────────────────────────────────────

  async findAll(businessId: string, query: ExpenseQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { businessId, deletedAt: null };

    if (query.search) {
      where.OR = [
        { description: { contains: query.search, mode: 'insensitive' } },
        { category: { name: { contains: query.search, mode: 'insensitive' } } },
        { expenseNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(new Date(query.endDate).getTime() + 86400000);
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc';
    } else {
      orderBy.date = 'desc';
    }

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    const totalAmount = await this.prisma.expense.aggregate({
      where: { ...where, deletedAt: null },
      _sum: { amount: true },
    });

    return {
      data: expenses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalAmount: Number(totalAmount._sum.amount || 0),
        count: total,
      },
    };
  }

  async findById(id: string, businessId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, businessId, deletedAt: null },
      include: {
        category: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(businessId: string, userId: string, dto: CreateExpenseDto) {
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id: dto.categoryId, businessId, isActive: true },
    });

    if (!category) {
      throw new BadRequestException('Invalid expense category');
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const todayCount = await this.prisma.expense.count({
      where: { businessId, createdAt: { gte: todayStart, lt: todayEnd }, deletedAt: null },
    });
    const seq = (todayCount + 1).toString().padStart(4, '0');
    const expenseNumber = `EXP-${dateStr}-${seq}`;

    return this.prisma.expense.create({
      data: {
        businessId,
        userId,
        expenseNumber,
        categoryId: dto.categoryId,
        amount: dto.amount,
        description: dto.description.trim(),
        date: dto.date ? new Date(dto.date) : new Date(),
        paymentMethod: dto.paymentMethod || 'CASH',
      },
      include: {
        category: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async update(id: string, businessId: string, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (dto.categoryId) {
      const category = await this.prisma.expenseCategory.findFirst({
        where: { id: dto.categoryId, businessId, isActive: true },
      });
      if (!category) {
        throw new BadRequestException('Invalid expense category');
      }
    }

    const updateData: any = {};
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.description !== undefined) updateData.description = dto.description.trim();
    if (dto.date !== undefined) updateData.date = new Date(dto.date);
    if (dto.paymentMethod !== undefined) updateData.paymentMethod = dto.paymentMethod;

    return this.prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async remove(id: string, businessId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.expense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Expense deleted successfully' };
  }

  async getSummary(businessId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [todayResult, monthResult] = await Promise.all([
      this.prisma.expense.aggregate({
        where: { businessId, deletedAt: null, date: { gte: todayStart, lt: todayEnd } },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { businessId, deletedAt: null, date: { gte: monthStart, lt: monthEnd } },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      today: {
        total: Number(todayResult._sum.amount || 0),
        count: todayResult._count,
      },
      thisMonth: {
        total: Number(monthResult._sum.amount || 0),
        count: monthResult._count,
      },
    };
  }
}
