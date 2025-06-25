import { BadRequestException, Body, Controller, Get, Headers, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
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
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDTO } from "./dtos/requests/login.dto";
import { LoginFailedResponse } from "./dtos/responses/login.response";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ChangeEmailDto } from "./dtos/requests/change-email.dto";
import { ChangePasswordDto } from "./dtos/requests/change-password.dto";
import { dropRightWhile } from "lodash";
import { VerifyResetCodeDto } from "./dtos/requests/verify-reset-code.dto";
import { SendResetCodeDto } from "./dtos/requests/send-reset-code.dto";
import { ResetPasswordDto } from "./dtos/requests/reset-password.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User Login')
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiOkResponse({ type: LoginUserDTO, description: 'User logged in successfully.' })
  @ApiUnauthorizedResponse({ type: LoginFailedResponse, description: 'Invalid credentials' })
  @ApiBody({ type: LoginUserDTO })
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req, response);
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
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage('Get logged-in user info')
  @ApiOperation({ summary: 'Get logged-in user info' })
  @ApiResponse({ status: 200, description: 'User info returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  handleAccount(@User() user: IUser) {
    return this.authService.getAccount(user);
  }

  @Public()
  @Get("/refresh")
  @ApiOperation({ summary: 'Refresh access token with refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ResponseMessage("Get user by refresh token")
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies["refresh_token"]
    return this.authService.processNewToken(refreshToken, response);
  }
  
  @Public()
  @Post('/send-reset-code')
  @ApiOperation({ summary: 'Send reset code to reset password' })
  @ApiResponse({ status: 200, description: 'Sent reset code successfully.' })
  @ResponseMessage("Sent reset code successfully!")
  sendResetCode(@Body() dto: SendResetCodeDto) {
    return this.authService.sendResetCode(dto.email);
  }

  @Public()
  @Post('/verify-reset-code')
  @ApiOperation({ summary: 'Verify reset code to reset password' })
  @ResponseMessage("Verify reset code successfully!")
  verifyCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(dto.email, dto.digit);
  }

  @Post('/logout')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage('Logout User')
  @ApiOperation({ summary: 'Logout user and clear tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }

  @Get('/verify-email')
  @Public()
  @ApiOperation({ summary: 'Verify email by link' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async verifyEmail(@Query('email') email: string, @Query('token') token: string) {
    return this.authService.verifyEmail(email, token);
  }

  @Post('/resend-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async resendVerification(@User() user: IUser) {
    return this.authService.resendVerificationEmail(user);
  }


  @Patch('change-email')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage('Email updated successfully')
  changeEmail(
    @User() user: IUser,
    @Body() dto: ChangeEmailDto,
  ) {
    return this.authService.changeEmail(user.user_id, dto);
  }


  @Patch('change-password')
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ResponseMessage('Password updated successfully')
  changePassword(
    @User() user: IUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.user_id, dto);
  }

@Public()
@Post('/reset-password')
@ApiOperation({ summary: 'Reset password' })
@ApiResponse({ status: 201, description: 'Password reset successfully.' })
@ResponseMessage("Password reset successfully!")
async resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto.email, dto.newPassword);
}
}
