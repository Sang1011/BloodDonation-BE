import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'supersecret123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
