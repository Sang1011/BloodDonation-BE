import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

export class LogoutResponse extends ResponseData {
  @ApiProperty({ example: 'LOGOUT SUCCESSFULLY' })
  data: string;
}
