import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from './user-response';

export class UserPaginationMetaDto {
  @ApiProperty({ example: 1 })
  current: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 1 })
  pages: number;

  @ApiProperty({ example: 2 })
  total: number;
}

export class GetAllUserResponseDto {
  @ApiProperty({ type: UserPaginationMetaDto })
  meta: UserPaginationMetaDto;

  @ApiProperty({ type: [UserResponseDto] })
  result: UserResponseDto[];
}

