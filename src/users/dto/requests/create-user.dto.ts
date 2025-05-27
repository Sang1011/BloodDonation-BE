import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';
import { bloodRhFactor, bloodTypes } from 'src/shared/enums/blood.enum';
import { Gender, Role } from 'src/shared/enums/user.enum';


export class CreateUserDto {
    @ApiProperty({ example: 'Jane Doe' })
    @IsString()
    @IsNotEmpty({ message: "Name must not be empty" })
    name: string;

    @ApiProperty({ example: 'JaneDoe@gmail.com' })
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email must not be empty" })
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty({ message: "Password must not be empty" })
    password: string;

    @ApiProperty({ example: 'MEMBER' })
    @IsEnum(Role)
    @IsNotEmpty({ message: "Role must not be empty" })
    role: Role;

    @ApiProperty({ example: '0987654321' })
    @IsPhoneNumber("VN", { message: "Invalid phone number format" })
    @IsNotEmpty({ message: "Phone number must not be empty" })
    phone: string;

    @ApiProperty({
        type: String,
        format: 'date-time',
        example: '2000-01-01T00:00:00Z',
        description: 'Date of birth in ISO 8601 format',
    })
    @IsNotEmpty({ message: "Date of birth must not be empty" })
    dob: Date;

    @ApiProperty({ example: 'FEMALE' })
    @IsString()
    @IsNotEmpty({ message: "Gender must not be empty" })
    gender: Gender;

    @ApiProperty({ example: '12 Nguyen Trai, Hanoi' })
    @IsString()
    @IsNotEmpty({ message: "Address must not be empty" })
    address: string;

    @ApiProperty({ example: 'A' })
    @IsEnum(bloodTypes, { message: 'Invalid blood type' })
    @IsNotEmpty({ message: "Blood type must not be empty" })
    bloodType: bloodTypes;

    @ApiProperty({ example: '+' })
    @IsNotEmpty({ message: "Rh factor must not be empty" })
    @IsEnum(bloodRhFactor, { message: 'Invalid Rh factor' })
    rhFactor: bloodRhFactor;
}

export class RegisterUserDTO extends OmitType(CreateUserDto, ['role'] as const) {}



