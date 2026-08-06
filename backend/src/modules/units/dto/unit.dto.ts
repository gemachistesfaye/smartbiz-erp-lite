import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ example: 'Kilogram' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @MaxLength(10)
  symbol: string;

  @ApiPropertyOptional({ example: 'Weight measurement unit' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUnitDto {
  @ApiPropertyOptional({ example: 'Kilogram' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  symbol?: string;

  @ApiPropertyOptional({ example: 'Weight measurement unit' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
