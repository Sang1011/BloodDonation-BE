import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ example: 'Exciting Tech News!', description: 'News title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'New AI model released by OpenAI.', description: 'Short description of the news' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025/06/08', description: 'Date in YYYY/MM/DD format' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'https://example.com/image.png', required: false })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({ example: 'https://example.com/news', required: false })
  @IsOptional()
  @IsUrl()
  link?: string;
}
