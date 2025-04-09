import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsDateString, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'The title of the book',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'The author of the book',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 'Fiction',
    description: 'The category of the book',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 19.99,
    description: 'The price of the book',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 4.5,
    description: 'The rating of the book (1-5)',
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({
    example: '2023-01-01',
    description: 'The published date of the book',
  })
  @IsDateString()
  publishedDate: Date;
} 