import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Nodemailer 설정
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // 사용할 이메일 서비스 제공자
      auth: {
        user: this.configService.get<string>('EMAIL_SENDER_ADDRESS'), // 이메일 발신자의 이메일 주소
        pass: this.configService.get<string>('EMAIL_PASSWORD'), // 이메일 발신자의 비밀번호 또는 앱 비밀번호 (보안을 위해 환경 변수 등으로 처리하는 것이 좋음)
      },
    });
  }
  async sendEmail(to: string, tempPassword: string) {
    // 이메일 전송
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_SENDER_ADDRESS'), // 발신자 이메일 주소
      to, // 수신자 이메일 주소
      subject: '[Pet Care] 임시 비밀번호 발급', // 이메일 제목
      text: `임시 발급된 비밀번호는 ${tempPassword} 입니다. 빠른 기일 내로 변경해주시기 바랍니다.`, // 이메일 내용
    });
  }
}
