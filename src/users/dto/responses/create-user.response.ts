import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponseDTO {
  @ApiProperty({ example: '644ec3a6b4c6d8f2e9a12345' })
  _id: string;

  @ApiProperty({ example: '2025-05-27T12:34:56.789Z' })
  createdAt: string;
}