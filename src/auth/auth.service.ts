import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from 'src/users/dto/requests/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { IUser } from 'src/shared/interfaces/user.interface';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { RoleService } from 'src/roles/role.service';
import { EmailService } from 'src/email/email.service';
import { ChangeEmailDto } from './dtos/requests/change-email.dto';
import { ChangePasswordDto } from './dtos/requests/change-password.dto';
import { getHashPassword } from 'src/shared/utils/getHashPassword';
import { randomInt } from 'crypto';
import { UserRole } from 'src/shared/enums/user.enum';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private roleService: RoleService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService
  ) { }

  // username, pass la 2 tham so thu vien passport nem ve
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);

    if (!user) return null;

    const isValid = await this.usersService.isValidPassword(pass, user.password);
    if (!isValid) return null;

    const getRole = await this.roleService.findById(user.role_id);
    if(getRole.role_name !== UserRole.MEMBER){
      return user;
    }

    if (!user.is_verified) {
      throw new BadRequestException("Email của bạn chưa được xác minh. Vui lòng kiểm tra gmail");
    }
    return user;
  }

  async getAccount(user: IUser) {
    return this.usersService.findOne(user.user_id);
  }

  async login(request: Request, response: Response) {
    const user = request.user as any;
    const { user_id, fullname, email, role_id } = user;
    const getRole = await this.roleService.findById(role_id);

    const payload = {
      sub: "token login",
      iss: "from server",
      user_id,
      fullname,
      email,
      role: getRole.role_name,
    }
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refreshToken, user_id);

    // set refreshToken as cookies
    const getTime = parseInt(this.configService.get<string>("JWT_REFRESH_EXPIRE"), 10)
    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: getTime
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        user_id,
        fullname,
        email,
        role: getRole.role_name,
      }
    };
  }

  async register(user: RegisterUserDTO) {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException(MESSAGES.AUTH.EMAIL_EXIST);
    }
    const userCreated = await this.usersService.create(user);

    if (!userCreated) return null;
    const { user_id } = userCreated;


    this.emailService.sendVerifyEmail(user);


    return {
      user_id,
    };
  }

  createRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: "1d"
    });
    return refreshToken;
  }

  async processNewToken(refreshToken: string, response: Response) {
    try {
      // verify token
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refreshToken);
      if (!user) throw new BadRequestException(MESSAGES.AUTH.EXPIRED_TOKEN);
      const { user_id, fullname, email, role_id } = user;
      const getRole = await this.roleService.findById(role_id);

      const payload = {
        sub: "token refresh",
        iss: "from server",
        user_id,
        fullname,
        email,
        role: getRole.role_name
      };

      // Tạo access token mới
      const access_token = this.jwtService.sign(payload);

      // Tạo refresh token mới
      const refresh_token = this.createRefreshToken(payload);
      await this.usersService.updateUserToken(refresh_token, user_id);

      // set cookie mới
      response.clearCookie("refresh_token");
      const getTime = parseInt(this.configService.get<string>("JWT_REFRESH_EXPIRE"), 10);
      response.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: getTime
      });

      return {
        access_token,
      };
    } catch (error) {
      throw new BadRequestException(MESSAGES.AUTH.EXPIRED_TOKEN);
    }
  }

  async logout(user: IUser, response: Response) {
    await this.usersService.updateUserToken("", user.user_id);
    response.clearCookie("refresh_token");
    return "LOGOUT SUCCESSFULLY"
  }

  async verifyEmail(email: string, token: string) {
    const userVerify = await this.usersService.findOneByEmail(email);
    if (!userVerify || !userVerify.verify_token || userVerify.is_verified) {
      throw new BadRequestException('Invalid or already verified');
    }

    if (userVerify.verify_token !== token) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersService.updateVerifyToken(userVerify.user_id);
    return "EMAIL VERIFIED SUCCESSFULLY";
  }

  async resendVerificationEmail(user: IUser) {
    const userToVerify = await this.usersService.findOneByEmail(user.email);
    if (!userToVerify) {
      throw new BadRequestException('User not found');
    }

    if (userToVerify.is_verified) {
      throw new BadRequestException('Email already verified');
    }

    const { email, fullname } = user;
    // Resend verification email
    await this.emailService.sendVerifyEmail({
      email,
      fullname,
      password: '',
      gender: '',
      location: null,
      isRegister: true,
      phone: '',
      dob: new Date()
    });

    return "VERIFICATION EMAIL SENT SUCCESSFULLY";
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const exists = await this.usersService.findOneByEmail(dto.newEmail);
    if (exists) throw new BadRequestException('Email already in use');

    user.email = dto.newEmail;
    await user.save();

    return { message: 'Email updated' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findOneWithPass(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await this.usersService.isValidPassword(dto.newPassword, dto.oldPassword);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    const hashed = getHashPassword(dto.newPassword);
    user.password = hashed;
    await user.save();
    return { message: 'Password updated' };
  }

  async sendResetCode(email: string) {
    const exists = await this.usersService.findOneByEmail(email);
    if (!exists) {
      throw new BadRequestException("This mail haven't register yet!")
    }
    const digitCode = randomInt(100000, 999999);
    const expire = new Date(Date.now() + 5 * 60 * 1000);

    await this.usersService.updateDigitCode(exists.user_id, {
      digitCodeHashed: getHashPassword(digitCode.toString()),
      expired: expire
    });

    await this.emailService.sendEmailToResetRequest(exists.email, digitCode);
    return "Sent email to verify forget password request, please check your email!"
  }

  async verifyResetCode(email: string, digit: number) {
    const exists = await this.usersService.findOneByEmailWithDigitCode(email);
    if (!exists) {
      throw new BadRequestException("This mail hasn't been registered yet!");
    }

    const storedHash = exists.digit_code;
    if (!storedHash) {
      throw new BadRequestException("No reset code was requested.");
    }

    // Thử kiểm tra mã hợp lệ trong thời hạn
    const valid = this.usersService.isValidPassword(digit.toString(), storedHash);
    const isCodeExpired = new Date() > new Date(exists.digit_code_expire);
    if (!valid) {
      throw new BadRequestException("Invalid reset code.");
    }

    if (isCodeExpired) {
      throw new BadRequestException("Reset code expired.");
    }
    await this.usersService.resetDigitCode(exists.user_id);
    return "Reset code verified successfully";
  }
}

