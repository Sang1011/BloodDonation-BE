
// import { BadRequestException, Injectable } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';
// import { IUser } from 'src/users/dto/responses/users.interface';
// import { RegisterUserDTO } from 'src/users/dto/requests/create-user.dto';
// import { ConfigService } from '@nestjs/config';
// import { Response } from 'express';
// import { MESSAGES } from 'src/common/constants/messages.constants';

// @Injectable()
// export class AuthService {
//   constructor(private usersService: UsersService, 
//     private jwtService: JwtService,
//     private configService: ConfigService
//   ) {}

//   // username, pass la 2 tham so thu vien passport nem ve
//   async validateUser(username: string, pass: string): Promise<any> {
//     const user = await this.usersService.findOneByUsername(username);
//     if(user){
//         const isValid = await this.usersService.isValidPassword(pass, user.password);
//         if(isValid === true){
//             return user;
//         }
//     }
//     return null;
//   }

//   async login(user: IUser, response: Response) {
//     const { _id, name, email, role } = user;
//     const payload = {
//       sub: "token login",
//       iss: "from server",
//       _id,
//       name,
//       email,
//       role
//     }
//     const refreshToken = this.createRefreshToken(payload);
//     await this.usersService.updateUserToken(refreshToken, _id);

//     // set refreshToken as cookies
//     const getTime = parseInt(this.configService.get<string>("JWT_REFRESH_EXPIRE"),10)
//     response.cookie("refresh_token", refreshToken, {
//       httpOnly: true,
//       maxAge: getTime
//     });
    
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//           _id,
//           name,
//           email,
//           role
//       }
//     };
//   }

//   async register(user: RegisterUserDTO) {
//     const userCreated = await this.usersService.create(user);
//     if(!userCreated) return null;
//     const { _id, createdAt } = userCreated;
    
//     return {
//       _id,
//       createdAt
//     }; 
//   }

//   createRefreshToken(payload : any) {
//     const refreshToken = this.jwtService.sign(payload, {
//       secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
//       expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
//     });
//     return refreshToken;
//   }

//   async processNewToken(refreshToken : string, response: Response) {
//     try{
//       this.jwtService.verify(refreshToken, {
//         secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
//       })
//       const user = await this.usersService.findUserByToken(refreshToken);
//       if(!user) throw new BadRequestException(MESSAGES.AUTH.EXPIRED_TOKEN);
//       const { _id, name, email, role } = user;
//       const payload = {
//         sub: "token refresh",
//         iss: "from server",
//         _id,
//         name,
//         email,
//         role
//       }
//       const refresh_token = this.createRefreshToken(payload);
//       await this.usersService.updateUserToken(refresh_token, _id.toString());

//       // set refreshToken as cookies
//       response.clearCookie("refresh_token");
//       const getTime = parseInt(this.configService.get<string>("JWT_REFRESH_EXPIRE"),10)
//       response.cookie("refresh_token", refresh_token, {
//         httpOnly: true,
//         maxAge: getTime
//       });
      
//     }catch(error){
//       throw new BadRequestException(MESSAGES.AUTH.EXPIRED_TOKEN);
//     }
//   }

//   async logout(user: IUser, response: Response) {
//     await this.usersService.updateUserToken("", user._id);
//     response.clearCookie("refresh_token");
//     return "ok"
//   }
// }
  
