
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization && request.cookies?.refresh_token) {
      request.headers.authorization = `Bearer ${request.cookies.refresh_token}`;
    }

    return super.canActivate(context);
  }


  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(MESSAGES.AUTH.INVALID_TOKEN + " or " + MESSAGES.AUTH.EXPIRED_TOKEN);
    }
    return user;
  }
}
