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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';

@ApiTags('Suppliers')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all suppliers' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: SupplierQueryDto,
  ) {
    return this.suppliersService.findAll(user.businessId, query);
  }

  @Get('active')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all active suppliers (no pagination)' })
  async findAllActive(@CurrentUser() user: { businessId: string }) {
    return this.suppliersService.findAllActive(user.businessId);
  }

  @Get('stats')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get supplier statistics' })
  async getStats(@CurrentUser() user: { businessId: string }) {
    return this.suppliersService.getStats(user.businessId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get supplier by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.suppliersService.findById(id, user.businessId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create supplier' })
  async create(
    @Body() dto: CreateSupplierDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.suppliersService.create(user.businessId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update supplier' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.suppliersService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Soft delete supplier' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.suppliersService.remove(id, user.businessId);
  }

  @Patch(':id/restore')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Restore deleted supplier' })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.suppliersService.restore(id, user.businessId);
  }
}
