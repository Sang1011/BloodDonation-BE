import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role_name', 'email'] as const)
) {}
