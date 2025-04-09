import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBookDto {
  @ApiProperty({
    example: 'Fitzgerald',
    description: 'Filter books by author',
    required: false,
  })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({
    example: 'Fiction',
    description: 'Filter books by category',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 4,
    description: 'Filter books by minimum rating',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  rating?: number;

  @ApiProperty({
    example: 'Gatsby',
    description: 'Search books by title (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    example: 'price',
    description: 'Field to sort by',
    required: false,
    enum: ['price', 'rating', 'publishedDate'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['price', 'rating', 'publishedDate'])
  sortBy?: string;

  @ApiProperty({
    example: 'asc',
    description: 'Sort order (asc or desc)',
    required: false,
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
} 