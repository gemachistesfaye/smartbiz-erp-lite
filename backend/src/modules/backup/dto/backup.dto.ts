import { IsObject, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImportBackupDto {
  @ApiProperty({ description: 'Backup JSON data' })
  @IsObject()
  backupData!: Record<string, any>;
}

export class EqubRecommendationQueryDto {
  @ApiPropertyOptional({ description: 'Percentage of daily profit', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage?: number;

  @ApiPropertyOptional({ description: 'Number of days to analyze', default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number;
}
