import { ApiProperty } from '@nestjs/swagger';

export class SendDonateBloodDTO {
  @ApiProperty({ example: 'user@example.com', description: 'Email nhận mail' })
  email: string;
}