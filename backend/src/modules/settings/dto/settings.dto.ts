import { IsOptional, IsString, IsNumber, MaxLength, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'ETB' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: 'Br' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  currencySymbol?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ example: '0012345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  tinNumber?: string;

  @ApiPropertyOptional({ example: 'VAT-0012345' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  vatNumber?: string;

  @ApiPropertyOptional({ example: 'SmartBiz Store' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  receiptHeader?: string;

  @ApiPropertyOptional({ example: 'Thank you for shopping with us.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  receiptFooter?: string;
}

export class UpdateBusinessDto {
  @ApiPropertyOptional({ example: 'SmartBiz Store' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: '+251911234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'Bole, Addis Ababa' })
  @IsOptional()
  @IsString()
  address?: string;
}
