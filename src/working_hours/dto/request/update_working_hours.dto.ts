import { PartialType } from '@nestjs/swagger';
import { CreateWorkingHoursDto } from './create_working_hours.dto';

export class UpdateWorkingHoursDto extends PartialType(CreateWorkingHoursDto) {}