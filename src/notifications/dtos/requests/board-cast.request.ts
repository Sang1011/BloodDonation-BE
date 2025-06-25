import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BroadcastNotiDto {
  @ApiProperty({ example: 'Thông báo hệ thống' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Hệ thống sẽ bảo trì vào tối nay lúc 10h' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: 'SYSTEM' })
  @IsNotEmpty()
  @IsString()
  type: string; // Ví dụ: 'REMINDER', 'SYSTEM', 'ALERT', v.v.
}
