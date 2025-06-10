import { SetMetadata, UnauthorizedException } from "@nestjs/common";

export const Role = (...role: string[]): MethodDecorator => {
    return SetMetadata('roles', role);
};