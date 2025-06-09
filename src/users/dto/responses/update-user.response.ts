import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';
import { GetUserByIdResponse } from './get-user.response';
export class UpdateUserResponse extends ResponseData{
  @ApiProperty({ type: Object })
  data: GetUserByIdResponse;
}


