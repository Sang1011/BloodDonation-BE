import { ApiProperty } from '@nestjs/swagger';
import { DonateBloodResponseDto } from './donate_bloods.response.dto';

export class UpdateDonateBloodResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Donate blood record updated successfully.' })
  message: string;

  @ApiProperty({ type: () => DonateBloodResponseDto })
  data: DonateBloodResponseDto;
}