import {
  Controller,
  Get,
  Post,
  Patch,
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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';

@ApiTags('Sales')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sale' })
  async create(
    @Body() dto: CreateSaleDto,
    @CurrentUser() user: { businessId: string; id: string },
  ) {
    return this.salesService.createSale(user.businessId, user.id, dto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all sales' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: SaleQueryDto,
  ) {
    return this.salesService.findAll(user.businessId, query);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get sale by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.salesService.findById(id, user.businessId);
  }

  @Patch(':id/cancel')
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a sale (restore inventory)' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string; id: string },
  ) {
    return this.salesService.cancelSale(id, user.businessId, user.id);
  }
}
