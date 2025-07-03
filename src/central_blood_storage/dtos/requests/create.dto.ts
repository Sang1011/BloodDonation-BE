import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCentralBloodStorageDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  centralBlood_id: number;

  @ApiProperty({ example: "STO123456" })
  @IsNotEmpty()
  @IsString()
  storage_id: string;
}
