import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  role_name: string;
}
