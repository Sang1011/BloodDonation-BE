import { ApiProperty } from '@nestjs/swagger';

export class AskMessageDto {
  @ApiProperty({ example: 'Tôi muốn biết nhóm máu O có thể truyền cho ai?' })
  message: string;
}
