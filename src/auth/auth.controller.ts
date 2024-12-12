import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Get, Param } from "@nestjs/common";

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(
    @Body("firstName") firstName: string,
    @Body("lastName") lastName: string,
    @Body("email") email: string,
    @Body("password") password: string,
    @Body("phoneNumber") phoneNumber: string,
    @Body("loginMethod") loginMethod: string,
    @Body("isAdmin") isAdmin: boolean
  ) {
    console.log(Body());
    try {
      console.log(
        firstName,
        lastName,
        email,
        password,
        loginMethod,
        phoneNumber,
        isAdmin
      );
      const newUser = await this.authService.register(
        firstName,
        lastName,
        email,
        password,
        loginMethod,
        phoneNumber,
        isAdmin
      );

      return {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        status: "OK",
      };
    } catch (error) {
      if (error.code === "P2002") {
        throw new HttpException(
          "A user with this email already exists.",
          HttpStatus.BAD_REQUEST
        );
      } else {
        console.log(error);
        throw new HttpException(
          "An error occurred while processing your request.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  @Get("activate/:token")
  async activate(@Param("token") token: string) {
    try {
      const message = await this.authService.activate(token);
      return {
        status: "OK",
        message: message,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("login")
  async login(@Body() body) {
    const { email, password, loginMethod, phoneNumber } = body;
    try {
      const user = await this.authService.login(
        email,
        password,
        loginMethod,
        phoneNumber
      );
      return {
        result: "loginOk",
        message: "user logged in successfully",
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } catch (error) {
      switch (error.message) {
        case "WrongPassword":
          throw new HttpException("WrongPassword", HttpStatus.BAD_REQUEST);
        case "notActivated":
          throw new HttpException(
            "notActivated",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        case "activateTokenStillValid":
          throw new HttpException(
            "activateTokenStillValid",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        case "userNotFound":
          throw new HttpException(
            "userNotFound",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        default:
          throw new HttpException("unknown", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
