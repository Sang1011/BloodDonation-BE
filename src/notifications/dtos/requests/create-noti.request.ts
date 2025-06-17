import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user_abc123' })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({ example: 'Bạn có lịch hiến máu ngày mai' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Vui lòng đến điểm hiến máu vào lúc 9h sáng ngày mai.' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'reminder' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: '/schedule/detail/abc123' })
  @IsOptional()
  @IsString()
  link?: string;
}
