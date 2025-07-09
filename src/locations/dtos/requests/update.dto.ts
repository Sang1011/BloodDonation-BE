import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  // @ApiPropertyOptional({ example: '86' })
  // @IsString()
  // @IsOptional()
  // house_number?: string;

  // @ApiPropertyOptional({ example: 'Nguyễn Huệ' })
  // @IsString()
  // @IsOptional()
  // road?: string;

  @ApiPropertyOptional({ example: 'Phường Bến Nghé' })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiPropertyOptional({ example: 'Quận 1' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ example: 'TP. Hồ Chí Minh' })
  @IsString()
  @IsOptional()
  city?: string;
}
