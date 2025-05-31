
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/locations/dtos/requests/create.dto';
import { Gender } from 'src/shared/enums/user.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'jane.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'supersecret123' })
    @IsString()
    @IsNotEmpty()
    password: string;

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

export class RegisterUserDTO extends OmitType(CreateUserDto, ["role_name"] as const) {
  @ApiProperty({ example: 'jane.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'supersecret123' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'Jane Doe' })
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({ example: Gender.FEMALE, enum: Gender })
    @IsEnum(Gender)
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ type: CreateLocationDto })
    @ValidateNested()
    @Type(() => CreateLocationDto)
    location: CreateLocationDto;

    isRegister: true;
}



