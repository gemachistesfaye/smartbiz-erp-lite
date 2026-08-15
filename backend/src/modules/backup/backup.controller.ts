import { Controller, Get, Post, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BackupService } from './backup.service';
import { ImportBackupDto } from './dto/backup.dto';

@ApiTags('Backup')
@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('export')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Export business backup data' })
  async exportBackup(
    @CurrentUser() user: { businessId: string },
    @Res() res: Response,
  ) {
    const backup = await this.backupService.exportBackup(user.businessId);
    res.setHeader(
      'Content-Disposition',
      `attachment; backup-${new Date().toISOString().split('T')[0]}.json`,
    );
    return res.json(backup);
  }

  @Post('import')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Import backup data into current business' })
  async importBackup(
    @CurrentUser() user: { businessId: string },
    @Body() dto: ImportBackupDto,
  ) {
    return this.backupService.importBackup(user.businessId, dto.backupData);
  }
}
