import { IsEnum, IsNotEmpty } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { bloodRhFactor } from "src/shared/enums/blood.enum";

export class RhsDto {
    
    @ApiProperty({ example: bloodRhFactor.POSITIVE, enum: bloodRhFactor })
    @IsEnum(bloodRhFactor)
    @IsNotEmpty()
    blood_Rh: bloodRhFactor;
}
