import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsEnum } from "class-validator";
import { bloodTypes } from "src/shared/enums/blood.enum";

export class BloodTypeDto {
    
    @ApiProperty({ example: bloodTypes.A, enum: bloodTypes })
    @IsEnum(bloodTypes)
    @IsNotEmpty()
    blood_name: string;
} 