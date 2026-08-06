import {
  Controller,
  Get,
  Post,
  Param,
  Body,
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
import { StockService } from './stock.service';
import {
  CreateStockReceivingDto,
  StockReceivingQueryDto,
  CreateStockAdjustmentDto,
} from './dto/stock.dto';

@ApiTags('Stock')
@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('receive')
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Receive stock from supplier' })
  async receiveStock(
    @Body() dto: CreateStockReceivingDto,
    @CurrentUser() user: { id: string; businessId: string },
  ) {
    return this.stockService.receiveStock(user.businessId, user.id, dto);
  }

  @Get('receive')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all stock receivings' })
  async findAllReceivings(
    @CurrentUser() user: { businessId: string },
    @Query() query: StockReceivingQueryDto,
  ) {
    return this.stockService.findAllReceivings(user.businessId, query);
  }

  @Get('receive/:id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get stock receiving by ID' })
  async findReceivingById(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.stockService.findReceivingById(id, user.businessId);
  }

  @Post('receive/:id/cancel')
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel stock receiving' })
  async cancelReceiving(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; businessId: string },
  ) {
    return this.stockService.cancelReceiving(id, user.businessId, user.id);
  }

  @Post('adjust')
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adjust stock (increase/decrease)' })
  async adjustStock(
    @Body() dto: CreateStockAdjustmentDto,
    @CurrentUser() user: { id: string; businessId: string },
  ) {
    return this.stockService.adjustStock(user.businessId, user.id, dto);
  }
}
