import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

class RoleDto {
  @ApiProperty({ example: 'MEMBER' })
  role_name: string;

  @ApiProperty({ example: '683a83c8db0ae2234d2c781a' })
  role_id: string;
}

class LocationDto {
  @ApiProperty({ example: '192.168.0.1' })
  ipAddress: string;

  @ApiProperty({ example: 'Vietnam' })
  country: string;

  @ApiProperty({ example: 'District 1' })
  district: string;

  @ApiProperty({ example: 'Nguyen Hue' })
  road: string;

  @ApiProperty({ example: '683a8fb7c86d81d306fa9e4d' })
  location_id: string;
}

export class GetAccountDataDto {
  @ApiProperty({ example: 'jane.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'Jane Doe' })
  fullname: string;

  @ApiProperty({ type: RoleDto })
  role_id: RoleDto;

  @ApiProperty({ example: 'Female' })
  gender: string;

  @ApiProperty({ type: LocationDto })
  location_id: LocationDto;

  @ApiProperty({ example: '683a8fb7c86d81d306fa9e4f' })
  user_id: string;
}


export class GetAccountResponse extends ResponseData {
  @ApiProperty({ type: GetAccountDataDto })
  data: GetAccountDataDto;
}
