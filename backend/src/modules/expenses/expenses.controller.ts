import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseQueryDto } from './dto/expense.dto';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-category.dto';

@ApiTags('Expenses')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // ── Categories ────────────────────────────────────────

  @Get('expense-categories')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get expense categories' })
  async getCategories(@CurrentUser() user: { businessId: string }) {
    return this.expensesService.getCategories(user.businessId);
  }

  @Get('expense-categories/:id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get expense category by ID' })
  async getCategoryById(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.getCategoryById(id, user.businessId);
  }

  @Post('expense-categories')
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create expense category' })
  async createCategory(
    @Body() dto: CreateExpenseCategoryDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.createCategory(user.businessId, dto);
  }

  @Patch('expense-categories/:id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update expense category' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseCategoryDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.updateCategory(id, user.businessId, dto);
  }

  @Delete('expense-categories/:id')
  @Roles('OWNER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete expense category' })
  async deleteCategory(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.deleteCategory(id, user.businessId);
  }

  // ── Expenses ──────────────────────────────────────────

  @Get('expenses')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get expenses' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: ExpenseQueryDto,
  ) {
    return this.expensesService.findAll(user.businessId, query);
  }

  @Get('expenses/summary')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get expense summary' })
  async getSummary(@CurrentUser() user: { businessId: string }) {
    return this.expensesService.getSummary(user.businessId);
  }

  @Get('expenses/:id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get expense by ID' })
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.findById(id, user.businessId);
  }

  @Post('expenses')
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create expense' })
  async create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: { businessId: string; id: string },
  ) {
    return this.expensesService.create(user.businessId, user.id, dto);
  }

  @Patch('expenses/:id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update expense' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.update(id, user.businessId, dto);
  }

  @Delete('expenses/:id')
  @Roles('OWNER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete expense' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.expensesService.remove(id, user.businessId);
  }
}
