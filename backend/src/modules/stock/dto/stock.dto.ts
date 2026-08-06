import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StockReceivingItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  buyingPrice!: number;
}

export class CreateStockReceivingDto {
  @ApiPropertyOptional({ description: 'Supplier ID' })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ example: 'PO-2024-001' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  purchaseReference?: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ type: [StockReceivingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockReceivingItemDto)
  items!: StockReceivingItemDto[];

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transportationCost?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  packagingCost?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  storageCost?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  laborCost?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  otherCosts?: number;

  @ApiPropertyOptional({ example: 'Stock received in good condition' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class StockReceivingQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'RECEIVED', 'CANCELLED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class CreateStockAdjustmentDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId!: string;

  @ApiProperty({ enum: ['ADJUSTMENT', 'DAMAGE', 'LOSS', 'CORRECTION'] })
  @IsString()
  type!: 'ADJUSTMENT' | 'DAMAGE' | 'LOSS' | 'CORRECTION';

  @ApiProperty({ example: 10, description: 'Positive for increase, negative for decrease' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 'Inventory count correction' })
  @IsString()
  reason!: string;

  @ApiPropertyOptional({ example: 'Physical count mismatch' })
  @IsOptional()
  @IsString()
  notes?: string;
}
