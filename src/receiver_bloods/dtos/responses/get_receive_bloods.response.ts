import { ApiProperty } from '@nestjs/swagger';
import { ReceiveBloodResponseDto } from './receive_bloods.response.dto';

export class GetReceiveBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  
  @ApiProperty({ example: 'Receive blood record retrieved successfully' })
  message: string;

  @ApiProperty({ type: () => ReceiveBloodResponseDto })
  data: ReceiveBloodResponseDto;
}