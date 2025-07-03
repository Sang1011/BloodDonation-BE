import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';
export class DeleteObject {
  @ApiProperty({ example: 1, description: 'Number of deleted records (0 or 1)' })
  deleted: number;
}
export class DeleteUserResponse extends ResponseData{
  @ApiProperty({ type: DeleteObject })
  data: DeleteObject;
}
