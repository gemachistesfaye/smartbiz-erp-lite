import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'Quantity to sell', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateSaleDto {
  @ApiPropertyOptional({ description: 'Customer ID (required for credit sales)' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ enum: ['CASH', 'MOBILE_MONEY', 'CREDIT'], description: 'Payment method' })
  @IsEnum(['CASH', 'MOBILE_MONEY', 'CREDIT'] as const)
  paymentMethod!: 'CASH' | 'MOBILE_MONEY' | 'CREDIT';

  @ApiPropertyOptional({ description: 'Discount amount', example: 0, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({ type: [CreateSaleItemDto], description: 'Sale items (at least 1 required)' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
