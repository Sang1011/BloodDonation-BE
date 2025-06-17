import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsMongoId, IsString } from "class-validator";

export class CreateCentralBloodDto {
  @ApiProperty({ example: 'Ho Chi Minh Center' })
  @IsNotEmpty()
  @IsString()
  centralBlood_name: string;

  @ApiProperty({ example: '123 Nguyen Trai' })
  @IsNotEmpty()
  @IsString()
  centralBlood_address: string;

@ApiProperty({ example: '68473fd4e9ee73d6fca1d5a5' })
  @IsNotEmpty()
  @IsString()
  working_id: string;
}
