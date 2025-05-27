import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponse {
  @ApiProperty({ example: 1, description: 'Number of deleted records (0 or 1)' })
  deleted: number;
}
