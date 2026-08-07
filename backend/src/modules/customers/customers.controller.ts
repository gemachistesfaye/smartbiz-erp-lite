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
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
  CreatePaymentDto,
} from './dto/customer.dto';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all customers' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: CustomerQueryDto,
  ) {
    return this.customersService.findAll(user.businessId, query);
  }

  @Get('active')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all active customers (no pagination)' })
  async findAllActive(@CurrentUser() user: { businessId: string }) {
    return this.customersService.findAllActive(user.businessId);
  }

  @Get('stats')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get customer statistics' })
  async getStats(@CurrentUser() user: { businessId: string }) {
    return this.customersService.getStats(user.businessId);
  }

  @Get('overdue')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get customers with outstanding balances' })
  async getOverdue(@CurrentUser() user: { businessId: string }) {
    return this.customersService.getOverdueCustomers(user.businessId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get customer details with financial summary' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.customersService.getCustomerDetails(id, user.businessId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create customer' })
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.customersService.create(user.businessId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update customer' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.customersService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Soft delete customer' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.customersService.remove(id, user.businessId);
  }

  @Patch(':id/restore')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Restore deleted customer' })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.customersService.restore(id, user.businessId);
  }

  @Post(':id/payments')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a payment for customer' })
  async recordPayment(
    @Param('id') id: string,
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: { businessId: string; id: string },
  ) {
    return this.customersService.recordPayment(id, user.businessId, user.id, dto);
  }

  @Get(':id/payments')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get customer payment history' })
  async getPaymentHistory(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
    @Query() query: { page?: number; limit?: number; startDate?: string; endDate?: string },
  ) {
    return this.customersService.getPaymentHistory(id, user.businessId, query);
  }

  @Get(':id/credit-history')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get customer credit history' })
  async getCreditHistory(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.customersService.getCreditHistory(id, user.businessId);
  }

  @Get(':id/can-use-credit')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Check if customer can use credit for a given amount' })
  async canUseCredit(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
    @Query('amount') amount: number,
  ) {
    return this.customersService.canUseCredit(id, user.businessId, Number(amount));
  }
}
