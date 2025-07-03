import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponseDTO {
  @ApiProperty({ example: '644ec3a6b4c6d8f2e9a12345' })
  user_id: string;
}