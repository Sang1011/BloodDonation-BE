import { ApiProperty } from '@nestjs/swagger';

export class ExportBloodResponseDto {
  @ApiProperty()
  export_id: string;

  @ApiProperty()
  storage_id: string;

  @ApiProperty()
  blood_id: string;

  @ApiProperty()
  export_date: Date;

  @ApiProperty()
  status: string;
}