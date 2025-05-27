import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ["password"] as const) 
) {
    @ApiProperty({ example: '6653f759b0cc33abda52f0f9' })
    _id: string;

    @ApiProperty({ example: 'Test' })
    name?: string;
}

