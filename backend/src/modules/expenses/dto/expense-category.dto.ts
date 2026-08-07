import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseCategoryDto {
  @ApiProperty({ example: 'Transportation' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}

export class UpdateExpenseCategoryDto {
  @ApiProperty({ example: 'Transportation' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
