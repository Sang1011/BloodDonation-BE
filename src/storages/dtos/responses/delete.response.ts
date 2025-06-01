import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

export class DeleteByIdStorageDTOPartial {
  @ApiProperty({ example: true })
  acknowledged: boolean;

  @ApiProperty({ example: 1 })
  deletedCount: number;
}

export class DeleteByIdStorageDTO extends ResponseData {
  @ApiProperty({ type: DeleteByIdStorageDTOPartial })
  data: DeleteByIdStorageDTOPartial;
}
