
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from 'src/users/dto/requests/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IUser } from 'src/shared/interfaces/user.interface';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import { RoleService } from 'src/roles/role.service';
import { EmailService } from 'src/email/email.service';

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
    if (user) {
      const isValid = await this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async getAccount(user: IUser) {
    return this.usersService.findOne(user.user_id);
  }

  async login(user: IUser, response: Response) {
    const { user_id, fullname, email, role } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      user_id,
      fullname,
      email,
      role,
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
        role,
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

    
    this.emailService.sendRegisterEmail(user);
    

    return {
      user_id,
    };
  }

  createRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
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
}

