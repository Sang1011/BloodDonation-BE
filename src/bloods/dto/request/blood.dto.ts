import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BloodDto {


    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    blood_type_id: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    rh_id: number;
}