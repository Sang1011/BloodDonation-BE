import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: '192.168.0.1' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'District 1' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ example: 'Nguyen Hue' })
  @IsString()
  @IsNotEmpty()
  road: string;
}
