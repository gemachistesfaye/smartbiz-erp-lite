import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto, UpdateBusinessDto } from './dto/settings.dto';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get business settings' })
  async getSettings(@CurrentUser() user: { businessId: string }) {
    return this.settingsService.getSettings(user.businessId);
  }

  @Get('business')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get business information' })
  async getBusiness(@CurrentUser() user: { businessId: string }) {
    return this.settingsService.getBusiness(user.businessId);
  }

  @Patch()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Update business settings' })
  async updateSettings(
    @CurrentUser() user: { businessId: string },
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.settingsService.updateSettings(user.businessId, dto);
  }

  @Patch('business')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Update business information' })
  async updateBusiness(
    @CurrentUser() user: { businessId: string },
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.settingsService.updateBusiness(user.businessId, dto);
  }
}
