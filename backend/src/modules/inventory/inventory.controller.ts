import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { InventoryQueryDto, UpdateInventoryDto } from './dto/inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all inventory' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: InventoryQueryDto,
  ) {
    return this.inventoryService.findAll(user.businessId, query);
  }

  @Get('stats')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get inventory statistics' })
  async getStats(@CurrentUser() user: { businessId: string }) {
    return this.inventoryService.getStats(user.businessId);
  }

  @Get('low-stock')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get low stock items' })
  async getLowStock(@CurrentUser() user: { businessId: string }) {
    return this.inventoryService.getLowStock(user.businessId);
  }

  @Get('out-of-stock')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get out of stock items' })
  async getOutOfStock(@CurrentUser() user: { businessId: string }) {
    return this.inventoryService.getOutOfStock(user.businessId);
  }

  @Get('product/:productId')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get inventory by product ID' })
  async findByProductId(
    @Param('productId') productId: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.inventoryService.findByProductId(productId, user.businessId);
  }

  @Patch('product/:productId')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update inventory thresholds' })
  async update(
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.inventoryService.update(productId, user.businessId, dto);
  }
}
