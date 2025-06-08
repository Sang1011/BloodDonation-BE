import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

export class NewsResponseDto {
  @ApiProperty({ example: 101, description: 'Unique ID of the news' })
  news_id: number;

  @ApiProperty({ example: 'Exciting Tech News!', description: 'Title of the news' })
  title: string;

  @ApiProperty({ example: 'OpenAI released a new model.', description: 'Description of the news' })
  description: string;

  @ApiProperty({ example: '2025-06-08', description: 'Date in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({ example: 'https://example.com/image.png', required: false, description: 'URL to an image' })
  image?: string;

  @ApiProperty({ example: 'https://example.com/news', required: false, description: 'URL to full article' })
  link?: string;
}

export class GetNewsResponse extends ResponseData {
  @ApiProperty({ type: NewsResponseDto })
  data: NewsResponseDto;
}