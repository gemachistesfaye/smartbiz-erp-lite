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
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@ApiTags('Units')
@Controller('units')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get all units' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @CurrentUser() user: { businessId: string },
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.unitsService.findAll(user.businessId, {
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get unit by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.unitsService.findById(id, user.businessId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create unit' })
  async create(
    @Body() dto: CreateUnitDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.unitsService.create(user.businessId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update unit' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnitDto,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.unitsService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Soft delete unit' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.unitsService.remove(id, user.businessId);
  }

  @Patch(':id/restore')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Restore deleted unit' })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: { businessId: string },
  ) {
    return this.unitsService.restore(id, user.businessId);
  }
}
