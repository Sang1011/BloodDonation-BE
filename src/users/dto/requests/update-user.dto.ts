import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Gender } from "src/shared/enums/user.enum";
import { CreateLocationDto } from "src/locations/dtos/requests/create.dto";
import { Type } from "class-transformer";

export class UpdateUserDto {
        @ApiProperty({ example: 'jane.doe@example.com' })
        @IsEmail()
        email: string;
    
        @ApiProperty({ example: 'Jane Doe' })
        @IsString()
        fullname: string;
    
        @ApiProperty({ example: 'MEMBER' })
        @IsString()
        role_name: string;

        @ApiProperty({ example: '0987654321', required: false })
        @IsString()
        phone: string;

        @ApiProperty({ example: '2000-01-01', required: false })
        @IsDate()
        @Type(() => Date)
        dob: Date;
    
        @ApiProperty({ example: Gender.FEMALE, enum: Gender })
        @IsEnum(Gender)
        gender: string;
    
        @ApiProperty({ type: CreateLocationDto })
        @ValidateNested()
        @Type(() => CreateLocationDto)
        location: CreateLocationDto;
}