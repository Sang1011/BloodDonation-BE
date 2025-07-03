import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class VerifyResetCodeDto {
  @IsEmail()
  @ApiProperty({example: "ex@gmail.com"})
  email: string;

  @Type(() => Number) 
  @IsNumber()
  @ApiProperty({ example: 123456, type: Number }) 
  digit: number;
}
