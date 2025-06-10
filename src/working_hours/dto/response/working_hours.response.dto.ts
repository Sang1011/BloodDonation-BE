import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from 'src/shared/enums/working_hours.enum';

export class WorkingHoursResponseDto {

  @ApiProperty({ example: '68473a9725f487f46a043cad' })
  working_id: string;

  @ApiProperty({ example: 'Mon', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @ApiProperty({ example: '2024-01-01T08:00:00.000Z' })
  open_time: Date;

  @ApiProperty({ example: '2024-01-01T17:00:00.000Z' })
  close_time: Date;

  @ApiProperty({ example: true })
  is_open: boolean;

  @ApiProperty({ example: '2024-03-18T10:15:30.123Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-18T10:15:30.123Z' })
  updatedAt: Date;
}