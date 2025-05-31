import { ApiProperty } from '@nestjs/swagger';
import { DonateBloodResponseDto } from './donate_bloods.response.dto';

export class CreateDonateBloodResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Donate blood record created successfully.' })
  message: string;

  @ApiProperty({ type:() => DonateBloodResponseDto })
  data: DonateBloodResponseDto;
}