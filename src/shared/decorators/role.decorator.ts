import { SetMetadata, UnauthorizedException } from "@nestjs/common";

export const Roles = (...roles: string[]): MethodDecorator => {
    return SetMetadata('roles', roles);
};