import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseURL(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  getGmailPasswordForSendEmail(): string {
    return this.configService.get<string>('GmailPassword');
  }
}