import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

export class BloodGroupResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ enum: ['A', 'B', 'AB', 'O'] })
  bloodType: string;

  @ApiProperty({ enum: ['POSITIVE', 'NEGATIVE'] })
  rhFactor: string;

  @ApiProperty({ type: [String] , enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] })
  canDonateTo: string[];

  @ApiProperty({ type: [String], enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] })
  canReceiveFrom: string[];
}

export class AllBloodGroup {
  @ApiProperty({
    example: {
      current: 1,
      pageSize: 10,
      pages: 1,
      total: 8,
    },
  })
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };

  @ApiProperty({ type: [BloodGroupResponseDto] })
  result: BloodGroupResponseDto[];
}

export class GetAllBloodResponse extends ResponseData{
  @ApiProperty({ type: AllBloodGroup })
  data: AllBloodGroup;
}

export class GetIdBloodResponse extends ResponseData {
  @ApiProperty({ type: BloodGroupResponseDto })
  data: BloodGroupResponseDto;
}