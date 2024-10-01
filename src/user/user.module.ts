import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './service/user.service';
import { UserRepository } from './user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Posts, PostsSchema } from 'src/posts/posts.schema';
import { AwsService } from 'src/aws/aws.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import { memoryStorage } from 'multer';
import { EmailService } from 'src/email/email.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDISHOST, // Redis Cloud의 Public Endpoint
      port: process.env.REDISPORT, // Redis Cloud의 포트 (일반적으로 6379 또는 다른 포트)
      password: process.env.REDISPW, // Redis Cloud의 비밀번호
      username: process.env.REDISUSERNAME,
      ttl: 300, // 캐시의 기본 TTL (300초 = 5분)
    }),
    MulterModule.register({
      dest: './upload',
      storage: memoryStorage(),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Posts.name, schema: PostsSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, AwsService, EmailService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
