import { ApiProperty } from '@nestjs/swagger';

export class UploadRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;
}