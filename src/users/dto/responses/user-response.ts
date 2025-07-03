import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '68355618d7a1e66ee2d1e86a' })
  _id: string;

  @ApiProperty({ example: 'MEMBER' })
  role: string;

  @ApiProperty({ example: 'Jane Doe' })
  fullname: string;

  @ApiProperty({ example: 'JaneDoe@gmail.com' })
  email: string;

  @ApiProperty({ example: '0987654321' })
  phone: string;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  dob: Date;

  @ApiProperty({ example: 'FEMALE' })
  gender: string;

  @ApiProperty({ example: '12 Nguyen Trai, Hanoi' })
  address: string;

  @ApiProperty({ example: false })
  availableToDonate: boolean;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ example: '2025-05-27T06:05:12.829Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-27T06:05:12.829Z' })
  updatedAt: Date;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [0, 0],
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}
