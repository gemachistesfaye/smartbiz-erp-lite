import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InventoryTransactionsService } from './inventory-transactions.service';
import { InventoryTransactionQueryDto } from './dto/inventory-transaction.dto';

@ApiTags('Inventory Transactions')
@Controller('inventory-transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryTransactionsController {
  constructor(private readonly transactionsService: InventoryTransactionsService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all inventory transactions' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: InventoryTransactionQueryDto,
  ) {
    return this.transactionsService.findAll(user.businessId, query);
  }

  @Get('stats')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get transaction statistics' })
  async getStats(@CurrentUser() user: { businessId: string }) {
    return this.transactionsService.getStats(user.businessId);
  }

  @Get('product/:productId')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get transactions for a product' })
  async findByProductId(
    @Param('productId') productId: string,
    @CurrentUser() user: { businessId: string },
    @Query('limit') limit?: string,
  ) {
    return this.transactionsService.findByProductId(
      productId,
      user.businessId,
      limit ? parseInt(limit, 10) : 50,
    );
  }
}
