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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.categoriesService.findAll(user.businessId, {
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.categoriesService.findById(id, user.businessId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category' })
  async create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.categoriesService.create(user.businessId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update category' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.categoriesService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Soft delete category' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.categoriesService.remove(id, user.businessId);
  }

  @Patch(':id/restore')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Restore deleted category' })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.categoriesService.restore(id, user.businessId);
  }
}
