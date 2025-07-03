import { IsString, IsNotEmpty, IsEnum, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from 'src/shared/enums/working_hours.enum';

export class CreateWorkingHoursDto {

  @ApiProperty({ 
    description: 'Day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY
  })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  day_of_week: DayOfWeek;

  @ApiProperty({ 
    description: 'Opening time',
    example: '2024-01-01T08:00:00.000Z'
  })
  @IsDateString()
  @IsNotEmpty()
  open_time: string;

  @ApiProperty({ 
    description: 'Closing time',
    example: '2024-01-01T17:00:00.000Z'
  })
  @IsDateString()
  @IsNotEmpty()
  close_time: string;

  @ApiProperty({ 
    description: 'Whether the establishment is open on this day',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_open?: boolean = true;
}