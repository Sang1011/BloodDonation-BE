import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Gender } from "src/shared/enums/user.enum";
import { CreateLocationDto } from "src/locations/dtos/requests/create.dto";
import { Type } from "class-transformer";

export class UpdateUserDto {
    @ApiProperty({ example: 'jane.doe@example.com' })
        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @ApiProperty({ example: 'Jane Doe' })
        @IsString()
        @IsNotEmpty()
        fullname: string;
    
        @ApiProperty({ example: 'MEMBER' })
        @IsString()
        @IsNotEmpty()
        role_name: string;
    
        @ApiProperty({ example: Gender.FEMALE, enum: Gender })
        @IsEnum(Gender)
        @IsNotEmpty()
        gender: string;
    
        @ApiProperty({ type: CreateLocationDto })
        @ValidateNested()
        @Type(() => CreateLocationDto)
        location: CreateLocationDto;
}

