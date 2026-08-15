import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { EqubRecommendationQueryDto } from './dto/equb-recommendation.dto';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get dashboard overview data' })
  async getDashboard(
    @CurrentUser() user: { businessId: string },
    @Query() query: DashboardQueryDto,
  ) {
    return this.reportsService.getDashboard(user.businessId);
  }

  @Get('overview')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get reports overview KPIs' })
  async getOverview(
    @CurrentUser() user: { businessId: string },
    @Query() query: ReportFilterDto,
  ) {
    return this.reportsService.getOverview(user.businessId, query);
  }

  @Get('sales')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get sales report' })
  async getSalesReport(
    @CurrentUser() user: { businessId: string },
    @Query() query: ReportFilterDto,
  ) {
    return this.reportsService.getSalesReport(user.businessId, query);
  }

  @Get('inventory')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get inventory report' })
  async getInventoryReport(@CurrentUser() user: { businessId: string }) {
    return this.reportsService.getInventoryReport(user.businessId);
  }

  @Get('customers-credit')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get customer credit report' })
  async getCustomerCreditReport(@CurrentUser() user: { businessId: string }) {
    return this.reportsService.getCustomerCreditReport(user.businessId);
  }

  @Get('expenses')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get expenses report' })
  async getExpensesReport(
    @CurrentUser() user: { businessId: string },
    @Query() query: ReportFilterDto,
  ) {
    return this.reportsService.getExpensesReport(user.businessId, query);
  }

  @Get('profitability')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Get profitability report' })
  async getProfitability(
    @CurrentUser() user: { businessId: string },
    @Query() query: ReportFilterDto,
  ) {
    return this.reportsService.getProfitability(user.businessId, query);
  }

  @Get('equb-recommendation')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get equb contribution recommendation based on profit' })
  async getEqubRecommendation(
    @CurrentUser() user: { businessId: string },
    @Query() query: EqubRecommendationQueryDto,
  ) {
    return this.reportsService.getEqubRecommendation(
      user.businessId,
      query.percentage,
      query.days,
    );
  }
}
