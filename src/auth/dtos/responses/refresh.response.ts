import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

class RefreshDataDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiByZWZyZXNoIiwiaXNzIjoiZnJvbSBzZXJ2ZXIiLCJ1c2VyX2lkIjoiNjgzYThmYjdjODZkODFkMzA2ZmE5ZTRmIiwiZnVsbG5hbWUiOiJKYW5lIERvZSIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiTUVNQkVSIiwiaWF0IjoxNzQ4ODcxMjEyLCJleHAiOjE3NDg4NzIxMTJ9.Y83s3RZXBSjMTaROJpSMBgt1DUv01rdNHdHdEYGT268',
  })
  access_token: string;
}

export class RefreshTokenResponse extends ResponseData {
  @ApiProperty({ type: RefreshDataDto })
  data: RefreshDataDto;
}
