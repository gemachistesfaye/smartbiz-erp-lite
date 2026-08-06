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
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all products' })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.findAll(user.businessId, query);
  }

  @Get('stats')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get product statistics' })
  async getStats(@CurrentUser() user: { businessId: string }) {
    return this.productsService.getStats(user.businessId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.productsService.findById(id, user.businessId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product' })
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.productsService.create(user.businessId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update product' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.productsService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Soft delete product' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.productsService.remove(id, user.businessId);
  }

  @Patch(':id/restore')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Restore deleted product' })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.productsService.restore(id, user.businessId);
  }
}
