import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({ example: 'jane.doe@example.com', description: "Email" })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '@123', description: "Password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
