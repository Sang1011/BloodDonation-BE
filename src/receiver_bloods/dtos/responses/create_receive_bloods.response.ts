import { ApiProperty } from '@nestjs/swagger';
import { ReceiveBloodResponseDto } from './receive_bloods.response.dto';

export class CreateReceiveBloodResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Receive blood record created successfully.' })
  message: string;

  @ApiProperty({ type:() => ReceiveBloodResponseDto })
  data: ReceiveBloodResponseDto;
}