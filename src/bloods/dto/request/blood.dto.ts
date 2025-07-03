import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BloodDto {
    @ApiProperty({ example: "A" })
    @IsString()
    @IsNotEmpty()
    blood_type: string;

    @ApiProperty({ example: "+" })
    @IsString()
    @IsNotEmpty()
    rh: string;
}