import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsMongoId, IsString } from "class-validator";

export class CreateCentralBloodDto {
  @ApiProperty({ example: 'Ho Chi Minh Center' })
  @IsNotEmpty()
  @IsString()
  centralBlood_name: string;

  @ApiProperty({ example: '123 Nguyen Trai' })
  @IsNotEmpty()
  @IsString()
  centralBlood_address: string;

  @ApiProperty({ example: ['68473fd4e9ee73d6fca1d5a5', '684f0f28727a7001d329ad4c', '684f0f46727a7001d329ad50'] })
  @IsNotEmpty()
  @IsString({ each: true })
  working_id: string[];
}