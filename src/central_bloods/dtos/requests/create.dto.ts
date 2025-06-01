import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCentralBloodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  centralBlood_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  centralBlood_address: string;
}
