import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "src/prisma/prisma.service";
import { MailService } from "src/mail/mail.service";
import axios from "axios";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    loginMethod: string,
    phoneNumber: string,
    isAdmin: boolean
  ) {
    if (loginMethod === "userpass") {
      const token = uuidv4();
      const tokenExpires = new Date();
      tokenExpires.setHours(tokenExpires.getHours() + 24);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          hashedPassword: hashedPassword,
          activationToken: token, // to give user for verify from email
          activationTokenExpireDate: tokenExpires, // for check token is still expire
          isActivated: false,
          isAdmin: isAdmin,
        },
      });

      await this.mailService.sendMail(email, token);

      return newUser;
    } else {
      const token = uuidv4();
      const tokenExpires = new Date();
      tokenExpires.setHours(tokenExpires.getHours() + 24);
      const newUser = await this.prisma.user.create({
        data: {
          isActivated: false,
          phoneNumber: phoneNumber,
          isAdmin: false,
          activationToken: token, // to give user for verify from email
          activationTokenExpireDate: tokenExpires, // for check token is still expire
        },
      });

      await this.mailService.sendMail(email, token);

      return newUser;
    }
  }

  async login(
    email: string,
    password: string,
    loginMethod: string,
    phoneNumber: string
  ) {
    console.log(
      `password: ${password} & email:${email} & loginMethod:${loginMethod}`
    );
    if (loginMethod === "userpass") {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (user) {
        console.log(`email:${email} & password:${password}`);
        const passIsOK = await bcrypt.compare(password, user.hashedPassword);
        if (!passIsOK) {
          throw new Error("WrongPassword");
        }

        if (!user.isActivated) {
          if (user.activationTokenExpireDate > new Date()) {
            throw new Error("activateTokenStillValid");
          } else {
            const token = uuidv4();
            await this.mailService.sendMail(email, token);
            throw new Error("notActivated");
          }
        }

        return user;
      } else {
        throw new Error("userNotFound");
      }
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      if (user) {
        // send code to phone number
        axios.request({
          method: "GET",
          url: `https://api.kavenegar.com/v1/{API-KEY}/verify/lookup.json?receptor=09361234567&token=852596&template=myverification`,
        });

        return user;
      } else {
        throw new Error("userNotFound");
      }
    }
  }
  async activate(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        activationToken: token,
      },
    });

    if (user) {
      // Check if the token has expired
      if (user.activationTokenExpireDate > new Date()) {
        // Token is valid and not expired, activate the account and clear the activation token
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            isActivated: true,
            activationToken: null,
            activationTokenExpireDate: null,
          },
        });

        return "Account activated successfully";
      } else {
        // Token has expired
        throw new Error("Activation link has expired");
      }
    } else {
      // No user found with this activation token
      throw new Error("Invalid activation link");
    }
  }
}
