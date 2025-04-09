import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto {
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'The title of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'The author of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({
    example: 'Fiction',
    description: 'The category of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 19.99,
    description: 'The price of the book',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    example: 4.5,
    description: 'The rating of the book (1-5)',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  rating?: number;

  @ApiProperty({
    example: '2023-01-01',
    description: 'The published date of the book',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  publishedDate?: Date;
} 