import { ApiProperty } from '@nestjs/swagger';
import { ReceiveBloodResponseDto } from './receive_bloods.response.dto';

class MetaDto {
  @ApiProperty({ example: 1 })
  current: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 5 })
  pages: number;

  @ApiProperty({ example: 50 })
  total: number;
}

export class GetAllReceiveBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Retrieved all donate blood records successfully' })
  message: string;
  
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

 @ApiProperty({ isArray: true, type: () => ReceiveBloodResponseDto })
  data: ReceiveBloodResponseDto[];
}