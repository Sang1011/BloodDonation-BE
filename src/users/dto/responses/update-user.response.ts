import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

export class UpdateUserDataDto {
  @ApiProperty({ example: ['name', 'phone'], description: 'Fields updated' })
  updatedFields: string[];
}

export class UpdateUserResponse extends ResponseData{
  @ApiProperty({ type: Object })
  data: UpdateUserDataDto;
}


