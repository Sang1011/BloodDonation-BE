import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInforHealthDto {
  @ApiProperty({ example: 'USR001', description: 'ID của người dùng' })
  @IsString()
  user_id: string;

  @ApiProperty({ example: 'B001', description: 'ID của nhóm máu' })
  @IsString()
  blood_id: string;

  @ApiPropertyOptional({ example: 170, description: 'Chiều cao (cm)' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 60.5, description: 'Cân nặng (kg)' })
  @IsOptional()
  @IsNumber()
  weight_decimal?: number;

  @ApiPropertyOptional({ example: 120, description: 'Huyết áp' })
  @IsOptional()
  @IsNumber()
  blood_pressure?: number;

  @ApiPropertyOptional({ example: 'Không có tiền sử bệnh lý', description: 'Tiền sử bệnh' })
  @IsOptional()
  @IsString()
  medical_history?: string;

  @ApiPropertyOptional({ example: '2024-12-01T00:00:00Z', description: 'Lần hiến máu gần nhất (ISO format)' })
  @IsOptional()
  @IsDateString()
  latest_donate?: Date;

  @ApiPropertyOptional({ example: 'Tốt', description: 'Tình trạng sức khỏe hiện tại' })
  @IsOptional()
  @IsString()
  status_health?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary', 
    description: 'File ảnh giấy khám sức khỏe (sẽ upload và lưu URL)',
  })
  @IsOptional()
  @IsString()
  img_health?: string;
}
