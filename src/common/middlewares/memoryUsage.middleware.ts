import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import * as os from 'os';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MemoryUsageMiddleware implements NestMiddleware {
  private transporter;

  constructor(@Inject('winston') private readonly logger: Logger) {
    // nodemailer를 통해 이메일 전송 설정
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // 이메일 서비스 제공자 (예: Gmail)
      auth: {
        user: process.env.EMAIL_SENDER_ADDRESS, // 발신자 이메일
        pass: process.env.EMAIL_PASSWORD, // 이메일 비밀번호 (앱 비밀번호 사용 권장)
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      // 프로세스 메모리 사용량 가져오기
      const memoryUsage = process.memoryUsage();
      const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2); // MB 단위로 변환
      const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
      const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
      const external = (memoryUsage.external / 1024 / 1024).toFixed(2);

      // 시스템 전체 메모리 사용량 가져오기
      const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2); // MB 단위로 변환
      const freeMemory = (os.freemem() / 1024 / 1024).toFixed(2); // MB 단위로 변환
      const usedMemory = (Number(totalMemory) - Number(freeMemory)).toFixed(2);
      const usedPercentage = (
        (Number(usedMemory) / Number(totalMemory)) *
        100
      ).toFixed(2);

      // 로그 기록
      this.logger.info(`Memory Usage after ${req.method} ${req.originalUrl}:`, {
        processMemory: {
          rss: `${rss} MB`,
          heapTotal: `${heapTotal} MB`,
          heapUsed: `${heapUsed} MB`,
          external: `${external} MB`,
        },
        systemMemory: {
          totalMemory: `${totalMemory} MB`,
          freeMemory: `${freeMemory} MB`,
          usedMemory: `${usedMemory} MB`,
          usedPercentage: `${usedPercentage}%`,
        },
      });

      // 메모리 사용량이 80%를 초과하면 이메일 알림 전송
      if (Number(usedPercentage) > 80) {
        this.logger.warn(
          `High memory usage detected! Used: ${usedPercentage}%`,
        );

        await this.sendMemoryAlertEmail(usedMemory, usedPercentage);
      }
    });

    next();
  }

  // 이메일 알림 전송 함수
  async sendMemoryAlertEmail(usedMemory: string, usedPercentage: string) {
    const mailOptions = {
      from: process.env.EMAIL_SENDER_ADDRESS, // 발신자 이메일
      to: process.env.EMAIL_TO_ADDRESS, // 수신자 이메일
      subject: 'Memory Usage Alert',
      text: `경고! 서버는 ${usedMemory} 의 메모리를 사용하고 있으며, 이는 총 메모리의 ${usedPercentage}% 입니다. 조사해 주세요`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.info('Memory alert email sent successfully.');
    } catch (error) {
      this.logger.error('Error sending memory alert email:', error);
    }
  }
}
