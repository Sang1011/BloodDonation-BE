import { ApiProperty } from '@nestjs/swagger';
import { WorkingHoursResponseDto } from './working_hours.response.dto';

export class CreateWorkingHoursResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Working hours created successfully' })
  message: string;

  @ApiProperty({ type: () => WorkingHoursResponseDto })
  data: WorkingHoursResponseDto;
}