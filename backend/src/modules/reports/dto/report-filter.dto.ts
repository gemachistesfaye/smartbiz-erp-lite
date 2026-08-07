import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportFilterDto {
  @ApiPropertyOptional({ description: 'Date range preset', example: '30d' })
  @IsOptional()
  @IsString()
  @IsIn(['today', 'yesterday', '7d', '30d', 'thisMonth', 'lastMonth', 'custom'])
  range?: string;

  @ApiPropertyOptional({ description: 'Start date for custom range (ISO string)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for custom range (ISO string)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by payment method' })
  @IsOptional()
  @IsString()
  @IsIn(['CASH', 'MOBILE_MONEY', 'CREDIT'])
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @IsString()
  customerId?: string;
}
