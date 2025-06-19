import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendResetCodeDto {
  @IsEmail()
  @ApiProperty({example: "ex@gmail.com"})
  email: string;
}
