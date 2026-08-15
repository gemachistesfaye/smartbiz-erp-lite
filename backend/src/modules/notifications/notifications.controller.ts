import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get notifications for current user' })
  async findAll(
    @CurrentUser() user: { id: string; businessId: string },
    @Query() query: { page?: number; limit?: number },
  ) {
    return this.notificationsService.findAll(user.businessId, user.id, query);
  }

  @Patch(':id/read')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; businessId: string },
  ) {
    return this.notificationsService.markAsRead(id, user.businessId, user.id);
  }

  @Patch('read-all')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: { id: string; businessId: string }) {
    return this.notificationsService.markAllAsRead(user.businessId, user.id);
  }

  @Get('unread-count')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@CurrentUser() user: { id: string; businessId: string }) {
    return this.notificationsService.getUnreadCount(user.businessId, user.id);
  }

  @Get('check-overdue')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Check and create overdue payment reminders' })
  async checkOverdueReminders(@CurrentUser() user: { businessId: string }) {
    return this.notificationsService.checkOverdueReminders(user.businessId);
  }
}
