import { ApiProperty } from '@nestjs/swagger';
import { DonateBloodResponseDto } from './donate_bloods.response.dto';

export class GetDonateBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;
  
  @ApiProperty({ example: 'Donate blood record retrieved successfully' })
  message: string;

  @ApiProperty({ type: () => DonateBloodResponseDto })
  data: DonateBloodResponseDto;
}