import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from 'src/shared/enums/user.enum';

class Location {
  @ApiProperty({ example: 'Point' })
  type: string;

  @ApiProperty({ example: [0, 0] })
  coordinates: number[];
}

export class GetUserByIdResponse {
  @ApiProperty({ example: '68355618d7a1e66ee2d1e86a' })
  _id: string;

  @ApiProperty({ enum: Role, example: Role.MEMBER })
  role: Role;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'JaneDoe@gmail.com' })
  email: string;

  @ApiProperty({ example: '0987654321' })
  phone: string;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  dob: Date;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  gender: Gender;

  @ApiProperty({ example: '12 Nguyen Trai, Hanoi' })
  address: string;

  @ApiProperty({ type: Location })
  location: Location;

  @ApiProperty({ example: false })
  availableToDonate: boolean;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ example: '2025-05-27T06:05:12.829Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-27T06:05:12.829Z' })
  updatedAt: Date;

  @ApiProperty({ example: 0 })
  __v: number;
}

export class GetUserByIdSwaggerResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Fetch user by id' })
  message: string;

  @ApiProperty({ type: GetUserByIdResponse })
  data: GetUserByIdResponse;
}
