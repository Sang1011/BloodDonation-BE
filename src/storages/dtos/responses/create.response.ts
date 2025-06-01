import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';
import { GetStorageResponse } from './get.response';

export class CreateStorageDTO extends ResponseData {
  @ApiProperty({ type: GetStorageResponse })
  data: GetStorageResponse;
}
