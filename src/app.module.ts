import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
