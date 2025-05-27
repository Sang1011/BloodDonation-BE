// import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
// import { AuthService } from "./auth.service";
// import { LocalAuthGuard } from "./guards/local-auth.guard";
// import { Public } from "src/shared/decorators/public.decorator";
// import { JwtAuthGuard } from "./guards/jwt-auth.guard";
// import { ResponseMessage } from "src/shared/decorators/message.decorator";
// import { RegisterUserDTO } from "src/users/dto/requests/create-user.dto";
// import { Response, Request } from "express";
// import { User } from "src/shared/decorators/users.decorator";
// import { IUser } from "src/users/dto/responses/users.interface";

// @Controller("auth")
// export class AuthController {
//   constructor(
//     private authService: AuthService
//   ) {}

//   @Public()
//   @UseGuards(LocalAuthGuard)
//   @ResponseMessage("User Login")
//   @Post("/login")
//   handleLogin(@Req() req, @Res({passthrough: true}) response : Response) {
//     console.log("login!");
//     return this.authService.login(req.user, response);
//   }

//   @Public()
//   @Post("/register")
//   @ResponseMessage("Register a new user")
//   handleRegister(@Body() registerUserDTO: RegisterUserDTO) {
//     console.log("register!");
//     return this.authService.register(registerUserDTO);
//   }

//   @Get("/account")
//   @ResponseMessage("Get user information")
//   handleAccount(@User() user: IUser) {
//     return {
//       user
//     }
//   }

//   @Public()
//   @Get("/refresh")
//   @ResponseMessage("Get user by refresh token")
//   handleRefreshToken(@Req() request: Request, @Res({passthrough: true}) response: Response) {
//     const refreshToken = request.cookies["refresh_token"]
//     return this.authService.processNewToken(refreshToken, response);
//   }

//   @Post("/logout")
//   @ResponseMessage("Logout User")
//   handleLogout(@User() user: IUser, @Res({passthrough: true}) response: Response) {
//     return this.authService.logout(user, response);
//   }
// }
