import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

class UserDto {
  @ApiProperty({ example: '683a8fb7c86d81d306fa9e4f' })
  user_id: string;

  @ApiProperty({ example: 'Jane Doe' })
  fullname: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email: string;
}

class LoginDataDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class LoginResponse extends ResponseData {
  @ApiProperty({ type: LoginDataDto })
  data: LoginDataDto;
}

export class LoginFailedResponse extends ResponseData {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: "Incorrect username or password!" })
  message: string;

  @ApiProperty({ example: "Unauthorized" })
  data: string;
}