import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jacobmarcosoliver@gmail.com',
        pass: 'xszo xvgn oeaf ttrp',
      },
    });
  }

  async sendMail(email: string, token: string) {
    let info = await this.transporter.sendMail({
      from: 'jacobmarcosoliver@gmail.com',
      to: email,
      subject: 'لینک فعال سازی حساب کاربری',
      text: `فعال سازی حساب کاربری: http://localhost:5000/api/auth/activate/${token}`,
      html: `<b>به مصاف خوش آمدید</b><br>
      با کلیک بر روی لینک حساب خود را فعال کنید
      <a href="http://localhost:5000/api/auth/activate/${token}">Activate</a>
      `,
    });
  }
}
