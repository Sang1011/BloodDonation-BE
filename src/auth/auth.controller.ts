import { BadRequestException, Body, Controller, Get, Headers, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RegisterUserDTO } from "src/users/dto/requests/create-user.dto";
import { Response, Request } from "express";
import { Public } from "src/shared/decorators/public.decorator";
import { ResponseMessage } from "src/shared/decorators/message.decorator";
import { User } from "src/shared/decorators/users.decorator";
import { IUser } from "src/shared/interfaces/user.interface";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { LoginUserDTO } from "./dtos/requests/login.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User Login')
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({ status: 201, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginUserDTO })
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Register a new user')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  handleRegister(@Body() registerUserDTO: RegisterUserDTO) {
    return this.authService.register(registerUserDTO);
  }

  @Get('/account')
  @ResponseMessage('Get logged-in user info')
  @ApiOperation({ summary: 'Get logged-in user info' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')    
  @ApiResponse({ status: 200, description: 'User info returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  handleAccount(@User() user: IUser) {
    return {
      user,
    };
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Get user by refresh token')
  @ApiOperation({ summary: 'Refresh access token with refresh token' })
  @ApiCookieAuth() // Dùng cookie để lấy refresh token
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  handleRefreshToken(
    @Req() req: Request,  // lấy request để lấy cookie
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new BadRequestException('Refresh token missing');
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout User')
  @ApiOperation({ summary: 'Logout user and clear tokens' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }
}
