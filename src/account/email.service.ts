import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password',
      },
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const mailOptions = {
      from: 'your_email@gmail.com',
      to,
      subject,
      text: content,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error(`Error sending email to ${to}: ${error}`);
    }
  }
}
