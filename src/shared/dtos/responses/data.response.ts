import { ApiProperty } from "@nestjs/swagger";

export class ResponseData {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Update a user' })
  message: string;
}
