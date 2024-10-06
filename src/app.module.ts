import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './posts/posts.module';
import { AwsModule } from './aws/aws.module';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';
import mongoose from 'mongoose';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Logger } from 'winston';
import { MemoryUsageMiddleware } from './common/middlewares/memoryUsage.middleware';

// 날짜 형식을 'yyyy-MM-dd HH:mm:ss'로 변환하는 함수 (재사용)
function formatDateToKST() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: formatDateToKST,
            }),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level}]: ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp({
              format: formatDateToKST,
            }),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/warn.log',
          level: 'warn',
          format: winston.format.combine(
            winston.format.timestamp({
              format: formatDateToKST,
            }),
            winston.format.json(),
          ),
        }),
      ],
    }),
    AuthModule,
    PostModule,
    AwsModule,
    EmailModule,
    AdminModule,
  ],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;

  // Winston Logger 주입
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(MemoryUsageMiddleware).forRoutes('*');
    if (this.isDev) {
      mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
        const msg = `${collectionName}.${methodName}(${JSON.stringify(
          methodArgs,
        )})`;
        this.logger.info(msg);
      });
    }
  }
}
