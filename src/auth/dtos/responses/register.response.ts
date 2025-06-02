import { ApiProperty } from '@nestjs/swagger';
import { ResponseData } from 'src/shared/dtos/responses/data.response';

class RegisterDataDto {
  @ApiProperty({ example: '683da89e41ec0eda751e3063' })
  _id: string;
}

export class RegisterResponse extends ResponseData {
  @ApiProperty({ type: RegisterDataDto })
  data: RegisterDataDto;
}
