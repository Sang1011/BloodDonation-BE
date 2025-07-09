import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiPropertyOptional({ example: '192.168.0.1' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ example: 'TP.HCM' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Quận 1' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ example: 'Bến Nghé' })
  @IsString()
  @IsNotEmpty()
  ward: string;

  // @ApiProperty({ example: 'Nguyễn Huệ' })
  // @IsString()
  // @IsNotEmpty()
  // road: string;

  // @ApiPropertyOptional({ example: '86' })
  // @IsString()
  // @IsOptional()
  // house_number?: string;
}
