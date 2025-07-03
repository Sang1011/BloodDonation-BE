import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

export class GetStorageResponse {
  @ApiProperty({ example: 'stg_123' })
  storage_id: string;

  @ApiProperty({ example: 'donate_456' })
  donate_id: string;

  @ApiProperty({ example: 'blood_789' })
  blood_id: string;

  @ApiProperty({ example: '2025-05-31T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 450 })
  ml: number;

  @ApiProperty({ example: 1 })
  unit: number;

  @ApiProperty({ example: '2026-05-31T00:00:00.000Z' })
  expired_date: Date;

  @ApiProperty({ example: 'available' })
  current_status: string;
}
export class GetByIdStorageDTO extends ResponseData {
  @ApiProperty({ type: GetStorageResponse })
  data: GetStorageResponse;
}
