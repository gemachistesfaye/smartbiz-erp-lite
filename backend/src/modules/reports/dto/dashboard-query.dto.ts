import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardQueryDto {
  @ApiPropertyOptional({ description: 'Date range filter', example: '7d' })
  @IsOptional()
  @IsString()
  range?: string;
}
