import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EqubRecommendationQueryDto {
  @ApiPropertyOptional({ description: 'Percentage of daily profit to recommend', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage?: number;

  @ApiPropertyOptional({ description: 'Number of days to analyze', default: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number;
}
