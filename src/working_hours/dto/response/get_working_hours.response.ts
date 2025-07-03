import { ApiProperty } from '@nestjs/swagger';
import { WorkingHoursResponseDto } from './working_hours.response.dto';

export class GetWorkingHoursResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Working hours retrieved successfully' })
  message: string;

  @ApiProperty({ type: () => WorkingHoursResponseDto })
  data: WorkingHoursResponseDto;
}